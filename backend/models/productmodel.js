const mongoose = require("mongoose"); // ✅ Add this
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please enter product name"] },
    description: { type: String, required: [true, "Please enter product description"] },
    price: { type: Number, required: [true, "Please enter product price"], default: 0 },
    ratings: { type: Number, default: 0 },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    category: { type: String, required: [true, "Please enter product category"] },
    brand: { type: String, required: [true, "Please enter product brand"] },
    stock: { type: Number, required: true, default: 0 },
    seller: { type: String, required: [true, "Please enter product seller"] },
    numOfReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who added product
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
