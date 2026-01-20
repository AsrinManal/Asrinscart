import React, { useState } from "react";
import axios from "axios";
import "./ProductList.css";

const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    stock: product?.stock || "",
    category: product?.category || "",
    description: product?.description || "",
    seller: product?.seller || "",
    brand: product?.brand || "",
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(product?.images || []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previewURLs = files.map((file) => URL.createObjectURL(file));
    setPreview(previewURLs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      images.forEach((img) => form.append("images", img));

      // ✅ Get JWT token from localStorage (or wherever you store it)
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // send token to backend
        },
      };

      let res;
      if (product) {
        res = await axios.put(
          `http://localhost:5000/api/admin/product/${product._id}`,
          form,
          config
        );
      } else {
        res = await axios.post(
          "http://localhost:5000/api/admin/product/new",
          form,
          config
        );
      }

      onSave(res.data.product);
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to save product");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>{product ? "Edit Product" : "Add New Product"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />
          <input
            type="text"
            name="seller"
            placeholder="Seller Name"
            value={formData.seller}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand Name"
            value={formData.brand}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>

          <input type="file" multiple accept="image/*" onChange={handleImageChange} />

          <div className="preview-images">
            {preview.map((img, index) => (
              <img
                key={index}
                src={img.url || img}
                alt="Preview"
                width="70"
                height="70"
                style={{ marginRight: "8px", borderRadius: "5px", objectFit: "cover" }}
              />
            ))}
          </div>
             
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              {product ? "Update" : "Add Product"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
