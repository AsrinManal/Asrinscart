import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaBox,
  FaHeart,
  FaClock,
  FaMapMarkedAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import defaultAvatar from "../../images/default_avatar.png";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recent, setRecent] = useState([]);
  const [address, setAddress] = useState({}); // ✅ FIXED missing state
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setOrders(res.data.user.orders || []);
        setWishlist(res.data.user.wishlist || []);
        setRecent(res.data.user.recentlyViewed || []);
        setAddress(res.data.user.address || {});
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("user");
      setUser({});
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout Error:", err);
      alert("Logout failed!");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    if (e.target.avatar.files[0]) {
      formData.append("avatar", e.target.avatar.files[0]);
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/me/update",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Profile updated successfully!");
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      console.error("Profile Update Error:", error);
      alert("Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = e.target;
    try {
      await axios.put(
        "http://localhost:5000/api/password/update",
        {
          oldPassword: oldPassword.value,
          newPassword: newPassword.value,
          confirmPassword: confirmPassword.value,
        },
        { withCredentials: true }
      );
      alert("Password updated successfully!");
      e.target.reset();
    } catch (error) {
      console.error("Password Update Error:", error);
      alert("Failed to update password");
    }
  };

  return (
    <div className="profile-wrapper">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img
            src={
              user?.avatar?.url
                ? `http://localhost:5000${user.avatar.url}`
                : defaultAvatar
            }
            alt="avatar"
            className="sidebar-avatar"
          />
          <h3>{user.name || "User"}</h3>
          <p>{user.email}</p>
        </div>

        <nav className="sidebar-menu">
          <button
            onClick={() => setActiveTab("overview")}
            className={activeTab === "overview" ? "active" : ""}
          >
            <FaUserCircle /> Overview
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={activeTab === "orders" ? "active" : ""}
          >
            <FaBox /> Orders
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={activeTab === "wishlist" ? "active" : ""}
          >
            <FaHeart /> Wishlist
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={activeTab === "recent" ? "active" : ""}
          >
            <FaClock /> Recently Viewed
          </button>
          <button
            onClick={() => setActiveTab("address")}
            className={activeTab === "address" ? "active" : ""}
          >
            <FaMapMarkedAlt /> Address
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={activeTab === "settings" ? "active" : ""}
          >
            <FaCog /> Settings
          </button>
          <button onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      <main className="profile-main">
        {activeTab === "overview" && (
          <div className="tab-content">
            <h2>Welcome, {user.name} 👋</h2>
            <div className="cards-grid">
              <div className="info-card">
                <h3>{orders.length}</h3>
                <p>Orders</p>
              </div>
              <div className="info-card">
                <h3>{wishlist.length}</h3>
                <p>Wishlist Items</p>
              </div>
              <div className="info-card">
                <h3>{recent.length}</h3>
                <p>Recently Viewed</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "address" && (
          <div className="tab-content">
            <h3>Saved Address</h3>
            {address && Object.keys(address).length > 0 ? (
              <div className="address-card">
                <p><strong>Street:</strong> {address.street}</p>
                <p><strong>City:</strong> {address.city}</p>
                <p><strong>State:</strong> {address.state}</p>
                <p><strong>ZIP:</strong> {address.zip}</p>
                <p><strong>Country:</strong> {address.country}</p>
              </div>
            ) : (
              <p>No saved address yet.</p>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="tab-content settings-tab">
            <form className="edit-profile-form" onSubmit={handleProfileUpdate}>
              <h3>Edit Profile</h3>
              <label>Name</label>
              <input
                type="text"
                value={user.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
              <label>Email</label>
              <input
                type="email"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <label>Avatar</label>
              <input type="file" name="avatar" accept="image/*" />
              <button type="submit" className="update-btn">
                Save Changes
              </button>
            </form>

            <form
              className="change-password-form"
              onSubmit={handleChangePassword}
            >
              <h3>Change Password</h3>
              <label>Old Password</label>
              <input type="password" name="oldPassword" required />
              <label>New Password</label>
              <input type="password" name="newPassword" required />
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" required />
              <button type="submit" className="update-btn">
                Change Password
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
