import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import defaultAvatar from "../../images/default_avatar.png";
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products/categories");
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(storedCart.length);
  }, []);

  useEffect(() => {
    const handleCartChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(updatedCart.length);
    };
    window.addEventListener("cartUpdated", handleCartChange);
    return () => window.removeEventListener("cartUpdated", handleCartChange);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    let url = `/search?`;
    if (searchQuery.trim()) url += `keyword=${encodeURIComponent(searchQuery)}&`;
    if (selectedCategory) url += `category=${encodeURIComponent(selectedCategory)}&`;
    if (sortOption) url += `sort=${sortOption}`;
    navigate(url);
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/logout", { withCredentials: true });
      localStorage.removeItem("user");
      setUser(null);
      setDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <Link class="navbar-brand fw-bold" to="/">Asrin Cart</Link>

        <form class="d-flex ms-auto" onSubmit={handleSearch}>
          <input
            type="text"
            class="form-control me-2"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            class="form-select me-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            class="form-select me-2"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Default Sort</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
            <option value="rating_high_low">Rating: High to Low</option>
            <option value="name_az">Name: A-Z</option>
            <option value="name_za">Name: Z-A</option>
          </select>

          <button type="submit" class="btn btn-light me-2">Search</button>

          {/* 🛒 Cart Icon */}
          <div class="cart-icon-container me-3" onClick={() => navigate("/cart")}>
            <FaShoppingCart class="cart-icon" />
            {cartCount > 0 && <span class="cart-count">{cartCount}</span>}
          </div>

          {/* ✅ Avatar dropdown */}
          {user ? (
            <div class="user-dropdown" onClick={toggleDropdown}>
              <img
                src={user?.avatar?.url ? `http://localhost:5000${user.avatar.url}` : defaultAvatar}
                alt={user?.name || "User"}
                class="avatar-img"
              />

              {dropdownOpen && (
                <div class="dropdown-content show">
                  {/* 🧑‍💼 Admin Dashboard link (visible only if user.role === "admin") */}
                  {user?.role === "admin" && (
                    <button
                      type="button"
                      class="dropdown-item"
                      onClick={() => {
                        navigate("/admin/dashboard");
                        setDropdownOpen(false);
                      }}
                    >
                      Dashboard
                    </button>
                  )}

                  <button
                    type="button"
                    class="dropdown-item"
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                  >
                    Profile
                  </button>

                  <button
                    type="button"
                    class="dropdown-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" class="btn btn-outline-light me-2">Login</Link>
              <Link to="/signup" class="btn btn-outline-light">Signup</Link>
            </>
          )}
        </form>
      </div>
    </nav>
  );
};

export default Header;