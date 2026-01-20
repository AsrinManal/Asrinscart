import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartItems,
  addProductToCart,
  removeProductFromCart,
  changeCartQuantity,
} from "../../slices/cartslice";

const CartTest = () => {
  const dispatch = useDispatch();
  const { cartItems, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  const handleAdd = () => {
    const sampleProduct = {
      productId: "68f6062a7dffcdf186359bea",
      name: "Test Product",
      price: 250,
      quantity: 1,
      image: "https://via.placeholder.com/100",
    };
    dispatch(addProductToCart(sampleProduct));
  };

  const handleIncrease = (id, qty) => {
    dispatch(changeCartQuantity({ productId: id, quantity: qty + 1 }));
  };

  const handleRemove = (id) => {
    dispatch(removeProductFromCart(id));
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>🛒 Cart Tester</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleAdd}>Add Product</button>

      <ul>
        {cartItems.map((item) => (
          <li key={item.productId}>
            {item.name} - ₹{item.price} × {item.quantity}
            <button onClick={() => handleIncrease(item.productId, item.quantity)}>+</button>
            <button onClick={() => handleRemove(item.productId)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartTest;
