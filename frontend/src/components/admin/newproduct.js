import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./admin.css";

const NewProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    images.forEach((img) => formData.append("images", img));

    try {
      await axios.post("/api/admin/product/new", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Product Created Successfully");
    } catch (err) {
      alert("❌ Failed: " + err.response?.data?.message);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <input name="name" placeholder="Product Name" onChange={handleChange} />
          <input name="price" type="number" placeholder="Price" onChange={handleChange} />
          <input name="category" placeholder="Category" onChange={handleChange} />
          <input name="stock" type="number" placeholder="Stock" onChange={handleChange} />
          <textarea name="description" placeholder="Description" onChange={handleChange} />
          <input type="file" multiple onChange={handleImageChange} />
          <button type="submit">Create Product</button>
        </form>
      </div>
    </div>
  );
};

export default NewProduct;
