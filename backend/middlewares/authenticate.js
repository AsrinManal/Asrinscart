// middlewares/authenticate.js
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsync = require("./catchasync");

// Check if user is logged in
exports.isAuthenticatedUser = catchAsync(async (req, res, next) => {
  let token;

  // ✅ Check for token in Authorization header or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // ❌ No token found
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  // ✅ Verify token and attach user to request
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);

  next();
});

// Check if user has required role(s)
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403)
      );
    }
    next();
  };
};
