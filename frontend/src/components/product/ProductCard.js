import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <div className="card h-100 shadow-sm border-primary">
    <img
      src="https://via.placeholder.com/300x200"
      className="card-img-top"
      alt={product.name}
    />
    <div className="card-body">
      <h5 className="card-title text-success">{product.name}</h5>
      <p className="card-text">{product.description}</p>
      <h6 className="text-primary">${product.price}</h6>
      <Link to={`/product/${product._id}`} className="btn btn-primary mt-2">View Details</Link>
    </div>
  </div>
);

export default ProductCard;
