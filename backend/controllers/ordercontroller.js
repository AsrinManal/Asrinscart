const Order = require("../models/ordermodel");
const Product = require("../models/productmodel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middlewares/catchasync");

// ===========================
// Create New Order (User)
// ===========================
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  // Update stock for each ordered item
  for (const item of orderItems) {
    await updateStock(item.product, item.quantity);
  }

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

// ===========================
// Get Single Order (User/Admin)
// ===========================
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email");

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// ===========================
// Get Logged-In User Orders
// ===========================
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// ===========================
// Get All Orders (Admin)
// ===========================
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find().populate("user", "name email");

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    count: orders.length,
    orders,
  });
});

// ===========================
// Update / Process Order (Admin)
// ===========================
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Order already delivered", 400));
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Order status updated",
  });
});

// ===========================
// Delete Order (Admin)
// ===========================
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

// ===========================
// Helper: Update Stock
// ===========================
async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);

  if (!product) return;

  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}
