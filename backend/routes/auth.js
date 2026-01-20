const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/usermodel"); // ✅ Make sure this is imported
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateShippingAddress, // ✅ Controller for shipping update
} = require("../controllers/authcontroller");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/authenticate");

const router = express.Router();

// =====================
// Multer Configuration (for Avatar Upload)
// =====================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) return cb(null, true);
  cb("Error: Images only!");
};

const upload = multer({ storage, fileFilter });

// =====================
// Public Routes
// =====================
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

// =====================
// Protected Routes (User)
// =====================
router.get("/me", isAuthenticatedUser, getUserProfile);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put("/me/update", isAuthenticatedUser, upload.single("avatar"), updateProfile);

// ✅ Shipping Routes
router.get("/user/shipping", isAuthenticatedUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, shippingInfo: user.shippingInfo });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/user/shipping", isAuthenticatedUser, updateShippingAddress);

// =====================
// Admin Routes
// =====================
router.get("/admin/users", isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.get("/admin/user/:id", isAuthenticatedUser, authorizeRoles("admin"), getUserById);
router.put("/admin/user/:id", isAuthenticatedUser, authorizeRoles("admin"), updateUser);
router.delete("/admin/user/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
