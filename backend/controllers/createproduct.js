const Product = require("../models/productmodel");

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body); // saves to MongoDB
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createProduct };
