import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // ✅ Get admin token from localStorage
  const token = localStorage.getItem("token");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data.products || []);
        setFiltered(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let list = products;

    if (search.trim()) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter.trim()) {
      list = list.filter(
        (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    setFiltered(list);
  }, [search, categoryFilter, products]);

  // Delete product ✅ with auth token
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // send token to backend
          },
        });
        setProducts(products.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Delete failed:", error.response?.data || error);
        alert(error.response?.data?.message || "Delete failed");
      }
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Add product button
  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // Unique categories for dropdown
  const categories = [...new Set(products.map((p) => p.category))].filter(Boolean);

  return (
    <div className="product-list">
      <div className="admin-header">
        <h2>🛍️ Product Management</h2>
        <button className="btn btn-success" onClick={handleAdd}>
          ➕ Add Product
        </button>
      </div>

      {/* 🔍 Search and Filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSave={(updatedProduct) => {
            if (editingProduct) {
              setProducts(
                products.map((p) =>
                  p._id === updatedProduct._id ? updatedProduct : p
                )
              );
            } else {
              setProducts([updatedProduct, ...products]);
            }
            setShowForm(false);
          }}
        />
      )}

      {/* 📦 Product Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Seller</th>        {/* Added seller */}
            <th>Brand</th>         {/* Added brand */}
            <th>Images</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <tr key={product._id}>
                <td>{product._id.slice(-6)}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.category}</td>
                <td>{product.seller}</td>   {/* Display seller */}
                <td>{product.brand}</td>     {/* Display brand */}
                <td>
                  {product.images?.map((img, i) => (
                    <img
                      key={i}
                      src={img.url || img}
                      alt="product"
                      width="40"
                      height="40"
                      style={{
                        borderRadius: "5px",
                        marginRight: "5px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
