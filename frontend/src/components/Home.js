import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";

const Home = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // to know if search happened

  // Handle search, sort, filter
  const handleSearch = async (keyword, sortOption, filterOption) => {
    try {
      setHasSearched(true); // mark that search has been performed
      const { data } = await axios.get(`http://localhost:5000/api/products?keyword=${keyword}`);
      let filtered = data.products || data;

      // Filter by category if selected
      if (filterOption) {
        filtered = filtered.filter(p => p.category === filterOption);
      }

      // Sort products
      if (sortOption === "price-low-high") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortOption === "price-high-low") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortOption === "popularity") {
        filtered.sort((a, b) => b.ratings - a.ratings);
      }

      setFilteredProducts(filtered);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div>
      <Header onSearch={handleSearch} />

      <div className="container mt-4">
        {!hasSearched && (
          <h5>Type a keyword in the search bar to find products</h5>
        )}

        {hasSearched && filteredProducts.length === 0 && (
          <h4>No products found</h4>
        )}

        {filteredProducts.length > 0 && (
          <div className="row">
            {filteredProducts.map((product) => (
              <div key={product._id} className="col-md-3 mb-3">
                <div className="card">
                  <img
                    src={product.image || "https://via.placeholder.com/150"}
                    className="card-img-top"
                    alt={product.name || "Product"}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name || "No Name"}</h5>
                    <p className="card-text">${product.price || "0"}</p>
                    <p className="card-text">Rating: {product.ratings || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
