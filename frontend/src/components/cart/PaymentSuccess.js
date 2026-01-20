import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h2 className="text-success">✅ Payment Successful!</h2>
      <p className="mt-3">Thank you for your purchase. Your payment was processed successfully.</p>

      <button className="btn btn-primary mt-4" onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
