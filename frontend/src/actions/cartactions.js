import axios from "axios";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM,
  GET_CART_ITEMS,
} from "../constants/cartConstants";

// Backend base URL
const BASE_URL = "http://localhost:5000/api";

// 🛒 Add item to cart
export const addToCart = (product) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/cart/add`, product);

    dispatch({
      type: ADD_TO_CART,
      payload: data.cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

// 🧾 Get all cart items
export const getCartItems = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/cart`);

    dispatch({
      type: GET_CART_ITEMS,
      payload: data.cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};

// 🔄 Update cart item quantity
export const updateCartItem = (productId, quantity) => async (dispatch) => {
  try {
    const { data } = await axios.put(`${BASE_URL}/cart/update`, {
      productId,
      quantity,
    });

    dispatch({
      type: UPDATE_CART_ITEM,
      payload: data.cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
  }
};

// ❌ Remove from cart
export const removeFromCart = (productId) => async (dispatch) => {
  try {
    const { data } = await axios.delete(`${BASE_URL}/cart/remove/${productId}`);

    dispatch({
      type: REMOVE_FROM_CART,
      payload: data.cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};
