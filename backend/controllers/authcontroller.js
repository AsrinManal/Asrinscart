const User = require("../models/usermodel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middlewares/catchasync");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

// REGISTER USER
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  // If avatar is uploaded via multer or base64
  const avatar = req.file
  ? { public_id: req.file.filename, url: `/uploads/avatars/${req.file.filename}` }
  : { public_id: "default_avatar", url: "https://cdn-icons-png.flaticon.com/512/847/847969.png" };


  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  sendToken(user, 201, res);
});
// LOGIN USER
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid email or password", 401));

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) return next(new ErrorHandler("Invalid email or password", 401));

  sendToken(user, 200, res);
});

// LOGOUT USER
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// FORGOT PASSWORD
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ErrorHandler("User not found with this email", 404));

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get("host")}/api/password/reset/${resetToken}`;
  const message = `Hello ${user.name},\n\nYour password reset link is:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

  try {
    await sendEmail({ email: user.email, subject: "Password Recovery - Asrin Cart", message });
    res.status(200).json({ success: true, message: `Password reset email sent to ${user.email}` });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// RESET PASSWORD
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
  if (!user) return next(new ErrorHandler("Reset password token is invalid or has expired", 400));

  if (req.body.password !== req.body.confirmPassword) return next(new ErrorHandler("Passwords do not match", 400));

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Optional: send confirmation email
  const message = `Hello ${user.name},\n\nYour password has been successfully changed.\n\nIf you did not do this, please contact support immediately.`;
  try { await sendEmail({ email: user.email, subject: "Password Changed - Asrin Cart", message }); } catch (err) { console.log(err.message); }

  sendToken(user, 200, res);
});

// =========================
// NEW FEATURES
// =========================

// Get Logged-in User Profile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, user });
});

// Update User Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  // Check old password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) return next(new ErrorHandler("Old password is incorrect", 400));

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// Update User Profile (name & email)
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newData = { name: req.body.name, email: req.body.email };

  // Optional: handle avatar upload if needed
  const user = await User.findByIdAndUpdate(req.user._id, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user });
});
// =========================
// ADMIN ROUTES
// =========================

// Get all users (admin)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

// Get user by ID (admin)
exports.getUserById = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({ success: true, user });
});

// Update user (admin)
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role, // admin or user
  };

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({ success: true, user });
});

// Delete user (admin)
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  await user.deleteOne();

  res.status(200).json({ success: true, message: "User deleted successfully" });
});
// =====================
// UPDATE SHIPPING ADDRESS
// =====================
exports.updateShippingAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, address, city, postalCode, phone, country } = req.body;

    if (!address || !city || !postalCode || !country || !phone) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.shippingInfo = { name, address, city, postalCode, phone, country };
    await user.save();

    res.status(200).json({
      success: true,
      message: "Shipping address updated successfully",
      shippingInfo: user.shippingInfo,
    });
  } catch (error) {
    console.error("Error updating shipping:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

