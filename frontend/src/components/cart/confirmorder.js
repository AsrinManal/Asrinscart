import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ConfirmOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, shipping } = location.state || {};

  if (!cart || !shipping) {
    return <p className="text-center mt-5">Order details not found.</p>;
  }

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-5">
      <h2>🧾 Confirm Order</h2>

      <div className="card p-4 shadow-sm mb-4">
        <h5>Shipping Address</h5>
        <p>
          <strong>{shipping.name}</strong> <br />
          {shipping.address}, {shipping.city}, {shipping.country} -{" "}
          {shipping.postalCode}
          <br />
          📞 {shipping.phone}
        </p>
      </div>

      <div className="card p-4 shadow-sm mb-4">
        <h5>Order Items</h5>
        {cart.map((item) => (
          <div
            key={item.productId}
            className="d-flex justify-content-between mb-2"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <hr />
        <h5 className="text-end">Total: ₹{totalAmount}</h5>
      </div>

      <div className="text-center">
        <button
          className="btn btn-success me-3"
          onClick={() => navigate("/payment", { state: { cart, shipping, totalAmount } })}
        >
          Proceed to Payment
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/cart")}>
          Back to Cart
        </button>
      </div>
    </div>
  );
};

export default ConfirmOrder;
