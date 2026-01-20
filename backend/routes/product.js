const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // <-- NEW

const {
  getProducts,
  getProductById,
  getCategories,
  createOrUpdateReview,
  getProductReviews,
  adminGetAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  adminGetAllReviews,
  deleteReview,
} = require("../controllers/productcontroller");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/authenticate");

// PUBLIC ROUTES
router.route("/products").get(getProducts);
router.route("/product/:id").get(getProductById);
router.route("/products/categories").get(getCategories);

// USER ROUTES
router.route("/review").put(isAuthenticatedUser, createOrUpdateReview);
router.route("/reviews").get(getProductReviews);

// ADMIN ROUTES
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), adminGetAllProducts);

router
  .route("/admin/product/new")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    upload.array("images", 5), // <-- allow up to 5 images
    createProduct
  );

router
  .route("/admin/product/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    upload.array("images", 5),
    updateProduct
  )
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router
  .route("/admin/reviews")
  .get(isAuthenticatedUser, authorizeRoles("admin"), adminGetAllReviews);

router
  .route("/admin/review")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

module.exports = router;
