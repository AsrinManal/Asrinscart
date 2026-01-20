import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./admin.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
        toast.error("❌ Error fetching orders");
      }
    };
    fetchOrders();
  }, [token]);

  // Start editing a specific order
  const handleEdit = (order) => {
    setEditingOrderId(order._id);
    setNewStatus(order.orderStatus);
  };

  // Save updated order status
  const handleUpdate = async (orderId) => {
    try {
      const { data } = await axios.put(
        `/api/admin/order/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Safely update frontend state even if backend doesn't return order object
      const updatedStatus = data.order?.orderStatus || newStatus;

      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, orderStatus: updatedStatus } : o
        )
      );

      setEditingOrderId(null);
      setNewStatus("");

      // Show success notification
      toast.success(data.message || "✅ Order status updated successfully!");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "❌ Failed to update order status");
    }
  };

  const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="admin-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2>All Orders</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-6)}</td>
                <td>
                  {editingOrderId === order._id ? (
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      {statusOptions.map((status, i) => (
                        <option key={i} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  ) : (
                    order.orderStatus
                  )}
                </td>
                <td>₹{order.totalPrice}</td>
                <td>
                  {editingOrderId === order._id ? (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleUpdate(order._id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditingOrderId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEdit(order)}
                    >
                      Update Status
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
