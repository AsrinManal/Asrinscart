import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import countryList from "react-select-country-list";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    country: "",
  });

  const navigate = useNavigate();
  const options = useMemo(() => countryList().getData(), []);

  // ✅ Fetch cart
  const fetchCart = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      if (data.success) setCart(data.cart);
    } catch (error) {
      toast.error("Failed to load cart!");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Quantity update
  const handleQuantityChange = async (productId, newQty) => {
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/cart/update",
        { productId, quantity: newQty },
        { withCredentials: true }
      );
      if (data.success) {
        setCart(data.cart);
        toast.info("Cart updated");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  // ✅ Remove item
  const handleRemoveItem = async (productId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`,
        { withCredentials: true }
      );
      if (data.success) {
        setCart(data.cart);
        toast.success("Item removed");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  // ✅ Clear cart
  const handleClearCart = async () => {
    try {
      for (const item of cart) {
        await axios.delete(
          `http://localhost:5000/api/cart/remove/${item.productId}`,
          { withCredentials: true }
        );
      }
      setCart([]);
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  // ✅ Total
  const getTotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ✅ Handle form input
  const handleInputChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (selectedOption) => {
    setShipping({ ...shipping, country: selectedOption.label });
  };

  // ✅ Confirm shipping → go to Payment
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const { name, address, city, postalCode, phone, country } = shipping;

    if (!name || !address || !city || !postalCode || !phone || !country) {
      toast.warning("Please fill all shipping fields");
      return;
    }

    const totalAmount = getTotal();

    toast.success("Shipping details confirmed!");
    navigate("/payment", { state: { cart, shipping, totalAmount } });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        {checkoutMode ? "📦 Shipping Details" : "🛒 Your Cart"}
      </h2>

      {!checkoutMode ? (
        <>
          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.productId} className="card p-3 mb-3 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        width="70"
                        height="70"
                        style={{ borderRadius: "10px", objectFit: "cover" }}
                      />
                      <div>
                        <h5>{item.name}</h5>
                        <p className="text-muted mb-1">₹{item.price}</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity + 1)
                        }
                      >
                        +
                      </button>

                      <button
                        className="btn btn-danger btn-sm ms-3"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="card p-3 mt-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <h5>Total: ₹{getTotal()}</h5>
                  <div>
                    <button
                      className="btn btn-warning me-2"
                      onClick={handleClearCart}
                    >
                      Clear Cart
                    </button>
                    <button
  className="btn btn-success"
  onClick={() => navigate("/shipping")}
>
  Proceed to Checkout
</button>

                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        // 🚚 Shipping Form
        <form
          onSubmit={handleShippingSubmit}
          className="card p-4 shadow-sm"
          style={{ maxWidth: "500px" }}
        >
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={shipping.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={shipping.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={shipping.city}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Postal Code</label>
            <input
              type="text"
              className="form-control"
              name="postalCode"
              value={shipping.postalCode}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={shipping.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Country</label>
            <Select
              options={options}
              onChange={handleCountryChange}
              placeholder="Select your country"
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCheckoutMode(false)}
            >
              Back to Cart
            </button>
            <button type="submit" className="btn btn-success">
              Confirm Shipping
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Cart;
