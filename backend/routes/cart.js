const express = require("express");
const router = express.Router();

// Temporary in-memory cart (for testing purpose)
// Later, you can integrate MongoDB or user-based cart
let tempCart = [];

// 🛒 Add item to cart
router.post("/cart/add", (req, res) => {
  const { productId, name, price, quantity, image } = req.body;

  // Check if product already exists
  const existingItem = tempCart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    tempCart.push({ productId, name, price, quantity, image });
  }

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart: tempCart,
  });
});

// 🧾 Get all cart items
router.get("/cart", (req, res) => {
  res.status(200).json({
    success: true,
    cart: tempCart,
  });
});

// 🔄 Update quantity of an item in cart
router.put("/cart/update", (req, res) => {
  const { productId, quantity } = req.body;

  const item = tempCart.find((item) => item.productId === productId);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found in cart",
    });
  }

  // Ensure quantity doesn’t go below 1
  item.quantity = Math.max(1, quantity);

  res.status(200).json({
    success: true,
    message: "Cart quantity updated",
    cart: tempCart,
  });
});

// ❌ Remove an item from cart
router.delete("/cart/remove/:productId", (req, res) => {
  const { productId } = req.params;
  tempCart = tempCart.filter((item) => item.productId !== productId);

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    cart: tempCart,
  });
});

module.exports = router;
