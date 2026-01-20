import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/product/${id}`);
      setProduct(data.product);
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImages([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(product).forEach(([k, v]) => formData.append(k, v));
    images.forEach((img) => formData.append("images", img));

    await axios.put(`/api/admin/product/${id}`, formData);
    alert("✅ Product Updated Successfully");
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <input name="name" value={product.name || ""} onChange={handleChange} />
          <input name="price" type="number" value={product.price || ""} onChange={handleChange} />
          <input name="category" value={product.category || ""} onChange={handleChange} />
          <input name="stock" type="number" value={product.stock || ""} onChange={handleChange} />
          <textarea name="description" value={product.description || ""} onChange={handleChange} />
          <input type="file" multiple onChange={handleImageChange} />
          <button type="submit">Update Product</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
