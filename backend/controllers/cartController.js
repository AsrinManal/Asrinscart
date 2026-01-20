let cart = [];

// Add to cart
exports.addToCart = (req, res) => {
  const { productId, name, price, quantity, image } = req.body;
  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, name, price, quantity, image });
  }

  res.status(200).json({ success: true, message: "Added to cart", cart });
};

// Get cart
exports.getCart = (req, res) => {
  res.status(200).json({ success: true, cart });
};

// Update quantity
exports.updateCartQuantity = (req, res) => {
  const { productId, quantity } = req.body;
  const item = cart.find((i) => i.productId === productId);

  if (!item) return res.status(404).json({ success: false, message: "Item not found" });
  item.quantity = quantity;

  res.status(200).json({ success: true, message: "Quantity updated", cart });
};

// Remove item
exports.removeFromCart = (req, res) => {
  const { productId } = req.params;
  cart = cart.filter((item) => item.productId !== productId);
  res.status(200).json({ success: true, message: "Removed from cart", cart });
};
