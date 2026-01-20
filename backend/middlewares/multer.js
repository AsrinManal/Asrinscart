// backend/middleware/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads/avatars directory exists before saving files
const avatarDir = path.join(__dirname, "../uploads/avatars");
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarDir); // ✅ absolute path (safer)
  },
  filename: function (req, file, cb) {
    const uniqueName = "avatar-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// File filter (accept only images)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png) are allowed!"));
  }
};

module.exports = multer({ storage, fileFilter });
