import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";

const ReviewList = () => {
  // State initialization
  const [reviews, setReviews] = useState({});
  const [filteredReviews, setFilteredReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/api/admin/reviews", { withCredentials: true });

      // Group reviews by productName
      const grouped = res.data.allReviews.reduce((acc, review) => {
        if (!acc[review.productName]) acc[review.productName] = [];
        acc[review.productName].push(review);
        return acc;
      }, {});

      setReviews(grouped);
      setFilteredReviews(grouped);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load reviews.");
      setLoading(false);
    }
  };

  const deleteReview = async (productId, reviewId) => {
  if (!window.confirm("Are you sure you want to delete this review?")) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/admin/review?productId=${productId}&reviewId=${reviewId}`,
      { withCredentials: true }
    );

    // Update state correctly by passing current state to update function
    setReviews((prevReviews) => {
      const updated = { ...prevReviews };
      for (let product in updated) {
        updated[product] = updated[product].filter((r) => r._id !== reviewId);
        if (updated[product].length === 0) delete updated[product];
      }
      return updated;
    });

    setFilteredReviews((prevReviews) => {
      const updated = { ...prevReviews };
      for (let product in updated) {
        updated[product] = updated[product].filter((r) => r._id !== reviewId);
        if (updated[product].length === 0) delete updated[product];
      }
      return updated;
    });

  } catch (err) {
    console.error(err);
    alert("Failed to delete review");
  }
};


  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = Object.keys(reviews)
      .filter((productName) => productName.toLowerCase().includes(query))
      .reduce((acc, key) => {
        acc[key] = reviews[key];
        return acc;
      }, {});

    setFilteredReviews(filtered);
  };

  if (loading) return <p className="loading">Loading reviews...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-wrapper">
      <h2>Product Reviews</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search product..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <span className="search-icon">🔍</span>
      </div>

      {Object.keys(filteredReviews).length === 0 && (
        <p className="no-reviews">No reviews found.</p>
      )}

      {/* Products stacked vertically */}
      <div className="admin-container">
        {Object.entries(filteredReviews).map(([product, productReviews]) => (
          <div key={product} className="product-column">
            <h3 className="product-title">{product}</h3>
            <div className="reviews-vertical-list">
              {productReviews.map((r) => (
                <div key={r._id} className="review-card">
                  <div className="review-header">
                    <span className="review-user">{r.name}</span>
                    <span className={`rating rating-${Math.round(r.rating)}`}>
                      {r.rating} ★
                    </span>
                  </div>
                  <p className="review-comment">{r.comment}</p>
                  <button
                    className="btn-delete"
                    onClick={() => deleteReview(r.productId, r._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
