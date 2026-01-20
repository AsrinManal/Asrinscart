const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE, // e.g., '7d'
  });

  const cookieExpireDays = process.env.COOKIE_EXPIRE || 7;

  res.status(statusCode).cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === "production",
  });

  // ✅ Send only necessary user details
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar, // ✅ important: send avatar
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

module.exports = sendToken;
