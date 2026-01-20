const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/productmodel");
const products = require("../data/products.json");
const connectDatabase = require("../config/database");

// Load environment variables (fixed path)
dotenv.config({ path: __dirname + "/../config/config.env" });

// Connect to MongoDB
connectDatabase();

// Import data
const importData = async () => {
  try {
    await Product.deleteMany(); // clear existing data
    await Product.insertMany(products); // insert JSON data
    console.log("✅ Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Data Import Failed:", error.message);
    process.exit(1);
  }
};

importData();
