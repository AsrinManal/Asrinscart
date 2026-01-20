const fs = require("fs");
const path = require("path");
const Product = require("../models/productmodel");
const catchAsync = require("../middlewares/catchasync");
const ErrorHandler = require("../utils/errorhandler");
const ApiFeatures = require("../utils/apifeautures");

// ============================
// GET all products (for users)
// ============================
const getProducts = catchAsync(async (req, res, next) => {
  const resultPerPage = 10;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .pagination(resultPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: products.length,
    productsCount,
    resultPerPage,
    products,
  });
});

// ============================
// GET all products (Admin only)
// ============================
const adminGetAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// ============================
// GET single product
// ============================
const getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  res.status(200).json({ success: true, product });
});

// ============================
// GET all unique categories
// ============================
const getCategories = catchAsync(async (req, res, next) => {
  const categories = await Product.distinct("category");
  res.status(200).json({ success: true, categories });
});

// ============================
// CREATE PRODUCT (Admin only)
const createProduct = catchAsync(async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new ErrorHandler("Access denied. Admins only.", 403));
  }

  // Convert uploaded files to objects
  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => ({
      public_id: file.filename,        // can be used for cloud storage later
      url: `/uploads/products/${file.filename}`,
    }));
  }

  const productData = {
    ...req.body,
    images,               // ✅ now matches schema
    user: req.user._id,
  };

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});


// UPDATE PRODUCT (Admin only)
const updateProduct = catchAsync(async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new ErrorHandler("Access denied. Admins only.", 403));
  }

  let product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  let imagePaths = product.images || [];

  if (req.files && req.files.length > 0) {
    imagePaths = req.files.map((file) => `uploads/products/${file.filename}`);
  }

  const updatedData = {
    ...req.body,
    images: imagePaths,
  };

  product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

// ============================
// DELETE product (Admin only)
// ============================
const deleteProduct = catchAsync(async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new ErrorHandler("Access denied. Admins only.", 403));
  }

  const product = await Product.findById(req.params.id?.trim());
  if (!product) return next(new ErrorHandler("Product not found", 404));

  // Delete product images from server
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      // ✅ If img is an object with 'url', use it
      const imgUrl = typeof img === "string" ? img : img.url;

      if (!imgUrl) return; // skip if undefined

      const filePath = path.join(
        __dirname,
        "..",
        imgUrl.replace(`${req.protocol}://${req.get("host")}`, "")
      );

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});


// ============================
// CREATE or UPDATE product review
// ============================
const createOrUpdateReview = catchAsync(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  if (!req.user || !req.user._id) {
    return next(new ErrorHandler("Unauthorized: user not found", 401));
  }

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const userId = req.user._id.toString();
  const existingReview = product.reviews.find(
    (rev) => rev.user && rev.user.toString() === userId
  );

  if (existingReview) {
    existingReview.rating = Number(rating);
    existingReview.comment = comment;
  } else {
    product.reviews.push({
      user: req.user._id,
      name: req.user.name || "Anonymous",
      rating: Number(rating),
      comment,
    });
  }

  product.numOfReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Review added/updated" });
});

// ============================
// GET all reviews for a product
// ============================
const getProductReviews = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// ============================
// GET all reviews (Admin only)
// ============================
const adminGetAllReviews = catchAsync(async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new ErrorHandler("Access denied. Admins only.", 403));
  }

  const products = await Product.find().select("name reviews");
  const allReviews = [];

  products.forEach((p) => {
    p.reviews.forEach((rev) =>
      allReviews.push({
        productId: p._id,
        productName: p.name,
        ...rev.toObject(),
      })
    );
  });

  res.status(200).json({
    success: true,
    count: allReviews.length,
    allReviews,
  });
});

// ============================
// DELETE a review (Admin only)
// ============================
const deleteReview = catchAsync(async (req, res, next) => {
  const { productId, reviewId } = req.query;

  // 1. Check admin access
  if (!req.user || req.user.role !== "admin") {
    return next(new ErrorHandler("Access denied. Admins only.", 403));
  }

  // 2. Find product
  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  // 3. Remove review
  const reviewExists = product.reviews.some(
    (rev) => rev._id.toString() === reviewId.toString()
  );
  if (!reviewExists) return next(new ErrorHandler("Review not found", 404));

  product.reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== reviewId.toString()
  );

  // 4. Update number of reviews and average rating
  product.numOfReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) /
    (product.reviews.length || 1);

  // 5. Save without validation (optional)
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});


module.exports = {
  getProducts,
  adminGetAllProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrUpdateReview,
  getProductReviews,
  adminGetAllReviews,
  deleteReview,
};
