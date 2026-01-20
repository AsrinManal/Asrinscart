// components/admin/Sidebar.js
import React from "react";
import "./Sidebar.css";

const Sidebar = ({ activeSection, setActiveSection }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul className="sidebar-menu">
        <li
          className={activeSection === "products" ? "active" : ""}
          onClick={() => setActiveSection("products")}
        >
          🛍️ Products
        </li>
        <li
          className={activeSection === "orders" ? "active" : ""}
          onClick={() => setActiveSection("orders")}
        >
          📦 Orders
        </li>
        <li
          className={activeSection === "users" ? "active" : ""}
          onClick={() => setActiveSection("users")}
        >
          👥 Users
        </li>
        <li
          className={activeSection === "reports" ? "active" : ""}
          onClick={() => setActiveSection("reports")}
        >
          📊 Reports
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
