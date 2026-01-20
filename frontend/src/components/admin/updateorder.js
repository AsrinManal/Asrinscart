import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./admin.css";

const UpdateOrder = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios.get(`/api/admin/order/${id}`, { withCredentials: true })
      .then((res) => setStatus(res.data.order.orderStatus));
  }, [id]);

  const updateOrder = async (e) => {
    e.preventDefault();
    await axios.put(`/api/admin/order/${id}`, { status }, { withCredentials: true });
    alert("Order updated");
  };

  return (
    <div className="admin-container">
      <h2>Update Order</h2>
      <form className="admin-form" onSubmit={updateOrder}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
        </select>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateOrder;
