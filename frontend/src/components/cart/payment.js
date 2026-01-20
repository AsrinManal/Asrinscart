// frontend/src/components/cart/payment.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FaLock, FaCreditCard, FaMapMarkerAlt } from "react-icons/fa";
import "./payment.css";

const CheckoutForm = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);

  // ✅ Load shipping info from backend or localStorage
  useEffect(() => {
    const fetchShipping = async () => {
      try {
        // Try to get saved shipping info from backend
        const { data } = await axios.get(
          "http://localhost:5000/api/user/shipping",
          { withCredentials: true }
        );
        if (data.shippingInfo) {
          setShippingInfo(data.shippingInfo);
          localStorage.setItem("shippingInfo", JSON.stringify(data.shippingInfo));
        } else {
          // fallback to localStorage
          const stored = localStorage.getItem("shippingInfo");
          if (stored) setShippingInfo(JSON.parse(stored));
        }
      } catch (err) {
        // fallback if backend fails
        const stored = localStorage.getItem("shippingInfo");
        if (stored) setShippingInfo(JSON.parse(stored));
      }
    };
    fetchShipping();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    try {
      // ✅ Save shipping info before payment (if available)
      if (shippingInfo && shippingInfo.address) {
        await axios.put("http://localhost:5000/api/user/shipping", shippingInfo, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      }

      // ✅ Create Stripe Payment Intent
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/process",
        { amount: totalAmount },
        { headers: { "Content-Type": "application/json" } }
      );

      const clientSecret = data.client_secret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: shippingInfo?.name,
            email: "user@example.com", // Replace with logged-in user's email if available
            phone: shippingInfo?.phone,
            address: {
              line1: shippingInfo?.address,
              city: shippingInfo?.city,
              postal_code: shippingInfo?.postalCode,
              country: shippingInfo?.country,
            },
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        navigate("/paymentsuccess");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-card">
      <h2 className="payment-title">
        <FaLock className="lock-icon" /> Secure Payment
      </h2>

      {/* ✅ Show shipping info from backend/localStorage */}
      {shippingInfo ? (
        <div className="saved-shipping">
          <h3><FaMapMarkerAlt /> Saved Shipping Address</h3>
          <p><strong>{shippingInfo.name}</strong></p>
          <p>{shippingInfo.address}</p>
          <p>
            {shippingInfo.city} - {shippingInfo.postalCode}
          </p>
          <p>{shippingInfo.country}</p>
          <p>📞 {shippingInfo.phone}</p>
          <hr />
        </div>
      ) : (
        <p className="no-address">⚠ No saved address found. Please add it first.</p>
      )}

      <div className="card-input-box">
        <FaCreditCard className="card-icon" />
        <CardElement className="stripe-input" />
      </div>

      {error && <div className="error-msg">⚠ {error}</div>}

      <button
        type="submit"
        className={`pay-btn ${processing ? "processing" : ""}`}
        disabled={processing}
      >
        {processing ? "Processing..." : `Pay ₹${totalAmount}`}
      </button>

      <p className="safe-note">Your payment is securely processed by Stripe.</p>
    </form>
  );
};

const Payment = () => {
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const totalAmount = 500;

  useEffect(() => {
    const getStripeApiKey = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/stripeapikey");
        setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        console.error("Stripe API Key Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    getStripeApiKey();
  }, []);

  return (
    <div className="payment-page">
      <div className="payment-wrapper">
        <div className="payment-header">
          <h1>💳 Checkout</h1>
          <p>Complete your payment securely and instantly.</p>
        </div>

        {loading ? (
          <div className="loading">Loading payment gateway...</div>
        ) : (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <CheckoutForm totalAmount={totalAmount} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Payment;
