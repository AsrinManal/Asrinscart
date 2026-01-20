import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ added useNavigate
import axios from "axios";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ initialize navigate
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // 🧭 Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/product/${id}`);
        setProduct(data.product);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch product details!");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // 🛒 Add to Cart
  const addToCart = async () => {
    try {
      const cartItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image:
          product.images && product.images.length > 0
            ? product.images[0].url
            : "/default.png",
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/cart/add",
        cartItem,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(`${product.name} added to cart!`);
        window.dispatchEvent(new Event("cartUpdated")); // update header cart count
      } else {
        toast.error("Failed to add to cart!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding product to cart!");
    }
  };

  // 💳 Buy Now → navigate to Shipping page
  const buyNow = () => {
    // Optional: you can pass the product via state to shipping page
    navigate("/shipping", { state: { product } });
  };

  // ⭐ Submit review
  const submitReview = async () => {
    if (rating === 0 || comment.trim() === "") {
      toast.error("Please provide both rating and comment.");
      return;
    }

    try {
      await axios.put(
        "http://localhost:5000/api/review",
        { rating, comment, productId: id },
        { withCredentials: true }
      );

      toast.success("Review added successfully!");

      // Refresh reviews
      const { data } = await axios.get(`http://localhost:5000/api/product/${id}`);
      setProduct(data.product);

      // Reset
      setRating(0);
      setComment("");
      setShowReviewForm(false);
    } catch (error) {
      toast.error("Failed to submit review.");
    }
  };

  if (loading) return <h2 className="text-center mt-5">Loading...</h2>;
  if (!product) return <h2 className="text-center mt-5">Product not found!</h2>;

  return (
    <div className="container my-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6">
          <img
            src={
              product.images && product.images.length > 0
                ? product.images[0].url
                : "/default.png"
            }
            alt={product.name}
            className="img-fluid rounded shadow-sm"
          />
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h2 className="text-primary fw-bold">{product.name}</h2>
          <p className="text-muted">{product.description}</p>
          <h4 className="text-success fw-semibold">₹{product.price}</h4>

          {/* Buttons */}
          <div className="my-3">
            <button className="btn btn-warning me-3" onClick={addToCart}>
              🛒 Add to Cart
            </button>
            <button className="btn btn-success" onClick={buyNow}>
              💳 Buy Now
            </button>
          </div>

          {/* Review Section */}
          <div className="mt-4">
            <button
              className="btn btn-outline-primary"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? "Cancel" : "Add Review"}
            </button>

            {showReviewForm && (
              <div className="card p-3 mt-3">
                <h5 className="fw-bold mb-2">Your Rating</h5>
                <div className="mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={25}
                      style={{ cursor: "pointer", marginRight: 5 }}
                      color={star <= rating ? "#FFD700" : "#ccc"}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  className="form-control mb-3"
                  placeholder="Write your review..."
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="btn btn-primary" onClick={submitReview}>
                  Submit Review
                </button>
              </div>
            )}
          </div>

          {/* Customer Reviews */}
          <div className="mt-4">
            <h5 className="fw-bold mb-2">Customer Reviews:</h5>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div key={index} className="border rounded p-2 mb-2 bg-light">
                  <strong>{review.name}</strong>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={16}
                        color={star <= review.rating ? "#FFD700" : "#ccc"}
                      />
                    ))}
                  </div>
                  <p className="mb-1">{review.comment}</p>
                  <small className="text-muted">
                    Rating: {review.rating}/5
                  </small>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
