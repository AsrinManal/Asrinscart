// Dashboard.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ProductList from "./ProductList";
import OrderList from "./orderlist";
import UserList from "./userlist";
import ReviewList from "./reviewlist";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("products");

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="dashboard-content">
        {activeSection === "products" && <ProductList />}
        {activeSection === "orders" && <OrderList />}
        {activeSection === "users" && <UserList />}
        {activeSection === "reports" && <ReviewList />}
      </div>
    </div>
  );
};

export default Dashboard;
