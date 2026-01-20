import React, { useState, useEffect } from "react";
import axios from "axios";
import getImageUrl from "../../utils/getImageUrl";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (searchQuery = "", category = "", sortOption = "") => {
    let filtered = [...products];
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    switch (sortOption) {
      case "price_low_high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high_low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating_high_low":
        filtered.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
        break;
      case "name_az":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_za":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    setFilteredProducts(filtered);
  };

  return (
    <div className="container mt-4">
      {filteredProducts.length === 0 ? (
        <h4 className="text-center">No products found</h4>
      ) : (
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product._id} className="col-md-3 mb-3">
              <div className="card h-100 shadow-sm">
                <img
                  src={getImageUrl(product.images)}
                  className="card-img-top"
                  alt={product.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">₹{product.price}</p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
