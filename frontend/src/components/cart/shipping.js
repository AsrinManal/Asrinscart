import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./shipping.css";

const countries = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "BR", name: "Brazil" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
];

const ShippingPage = () => {
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    country: "",
  });

  const [savedAddress, setSavedAddress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShipping = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/user/shipping", {
          withCredentials: true,
        });
        if (data.shippingInfo) {
          setSavedAddress(data.shippingInfo);
        }
      } catch (error) {
        console.log("No saved address yet");
      }
    };
    fetchShipping();
  }, []);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/user/shipping",
        shippingInfo,
        { withCredentials: true }
      );

      alert("Shipping Address Saved Successfully!");
      setSavedAddress(data.shippingInfo);
      navigate("/payment");
    } catch (error) {
      alert("Failed to save address");
      console.error(error);
    }
  };

  return (
    <div className="shipping-container">
      <h2>Shipping Information</h2>

      <form onSubmit={handleConfirm} className="shipping-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={shippingInfo.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingInfo.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingInfo.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shippingInfo.postalCode}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={shippingInfo.phone}
          onChange={handleChange}
          required
        />

        {/* ✅ Country Dropdown */}
        <select
          name="country"
          value={shippingInfo.country}
          onChange={handleChange}
          required
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>

        <button type="submit" className="confirm-btn">
          Confirm Shipping
        </button>
      </form>
    </div>
  );
};

export default ShippingPage;
