const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/ordercontroller");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/authenticate");

const router = express.Router();

// User Routes
router.post("/order/new", isAuthenticatedUser, newOrder);
router.get("/order/:id", isAuthenticatedUser, getSingleOrder);
router.get("/orders/me", isAuthenticatedUser, myOrders);


// Admin Routes
router.get("/admin/orders", isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router.get("/admin/order/:id", isAuthenticatedUser, authorizeRoles("admin"), getSingleOrder); // ✅ added
router.put("/admin/order/:id", isAuthenticatedUser, authorizeRoles("admin"), updateOrder);
router.delete("/admin/order/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
