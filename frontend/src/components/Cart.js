import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const [cart, setCart] = useState([]);

  // 🧭 Fetch cart
  const fetchCart = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      if (data.success) setCart(data.cart);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cart!");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🧮 Update quantity (increase or decrease)
  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return toast.warning("Quantity can't be less than 1");

    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/cart/update",
        { productId, quantity: newQty },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Cart updated!");
        // refresh cart instantly
        setCart((prev) =>
          prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: newQty }
              : item
          )
        );
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast.error("Failed to update quantity!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating quantity!");
    }
  };

  // ❌ Remove item
  const removeItem = async (productId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Item removed from cart!");
        setCart((prev) => prev.filter((item) => item.productId !== productId));
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast.error("Failed to remove item!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error removing item!");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        cart.map((item) => (
          <div key={item.productId} className="card p-3 mb-2">
            <div className="d-flex justify-content-between align-items-center">
              {/* 🖼️ Product Info */}
              <div className="d-flex align-items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  width="60"
                  className="me-3"
                />
                <div>
                  <h5 className="mb-1">{item.name}</h5>
                  <p className="text-success mb-0">₹{item.price}</p>
                </div>
              </div>

              {/* 🔢 Quantity Controls */}
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              {/* 💰 Subtotal & Remove */}
              <div className="text-end">
                <p className="fw-bold mb-1">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeItem(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
