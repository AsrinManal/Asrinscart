import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);

  const keyword = query.get("keyword") || "";
  const category = query.get("category") || "";
  const sort = query.get("sort") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let apiUrl = `http://localhost:5000/api/products?`;
        if (keyword) apiUrl += `keyword=${keyword}&`;
        if (category) apiUrl += `category=${category}&`;
        if (sort) apiUrl += `sort=${sort}&`;

        const { data } = await axios.get(apiUrl);
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [keyword, category, sort]);

  return (
    <div className="container mt-4">
      <h2>Search Results</h2>
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-3" key={product._id}>
              <div className="card">
                <img
                  src={product.images[0]?.url}
                  className="card-img-top"
                  alt={product.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Price: ₹{product.price}</p>
                  <p className="card-text">Category: {product.category}</p>
                  <p className="card-text">Rating: {product.ratings}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
