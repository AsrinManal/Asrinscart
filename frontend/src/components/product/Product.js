import React from "react";
import { Link } from "react-router-dom";


const Product = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.images[0].url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <Link to={`/product/${product._id}`} className="btn">View Details</Link>
    </div>
  );
};

export default Product;
