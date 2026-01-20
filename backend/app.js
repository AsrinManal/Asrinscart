const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const errorMiddleware = require("./middlewares/error");

// ==========================
// ENV CONFIG
// ==========================
dotenv.config({ path: "backend/config/config.env" });

// ==========================
// MIDDLEWARES
// ==========================
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ==========================
// STATIC FILES
// ==========================

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ==========================
// API ROUTES
// ==========================
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/payment");

app.use("/api", productRoutes);
app.use("/api", authRoutes);
app.use("/api", orderRoutes);
app.use("/api", cartRoutes);
app.use("/api", paymentRoutes);

// ==========================
// FRONTEND BUILD SERVING
// ==========================
const frontendPath = path.join(__dirname, "../frontend/build");

// Serve React static files
app.use(express.static(frontendPath));

// Catch-all → React Router
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ==========================
// ERROR HANDLER (LAST)
// ==========================
app.use(errorMiddleware);

module.exports = app;
