import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../layouts/Loader";

const Order = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingInfo: {
          name: user.name,
          email: user.email,
        },
        itemsPrice: cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
      };

      // No need to assign to 'data' since we're not using it
      await axios.post("/api/order/new", orderData, { withCredentials: true });

      setLoading(false);
      alert("Order placed successfully!");
      navigate("/"); // redirect to home or orders page
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || "Failed to place order. Try again."
      );
    }
  };

  return (
    <div className="container mt-5">
      {loading && <Loader />}
      <h2 className="text-center text-primary mb-4">Place Your Order</h2>
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row">
        <div className="col-md-8">
          <h4>Items</h4>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="d-flex justify-content-between align-items-center border-bottom py-2"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />
                <span>{item.name}</span>
                <span>
                  {item.quantity} x ₹{item.price} = ₹{item.quantity * item.price}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="col-md-4">
          <h4>Order Summary</h4>
          <div className="border p-3">
            <p>
              Total Items:{" "}
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </p>
            <p>
              Total Price: ₹
              {cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}
            </p>
            <button
              className="btn btn-success w-100 mt-3"
              onClick={placeOrder}
              disabled={loading || cartItems.length === 0}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
