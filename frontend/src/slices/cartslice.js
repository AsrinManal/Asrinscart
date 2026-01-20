import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// =======================
// Async Thunks (API calls)
// =======================

// 🛒 Add to Cart
export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async (product, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/cart/add`, product);
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Add to cart failed");
    }
  }
);

// 📦 Get Cart Items
export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/cart`);
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load cart");
    }
  }
);

// 🔄 Update Quantity
export const changeCartQuantity = createAsyncThunk(
  "cart/changeCartQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${BASE_URL}/cart/update`, { productId, quantity });
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

// ❌ Remove Product
export const removeProductFromCart = createAsyncThunk(
  "cart/removeProductFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/cart/remove/${productId}`);
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Remove failed");
    }
  }
);

// =======================
// Slice Definition
// =======================
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // 🛒 Add Product
      .addCase(addProductToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📦 Get Cart
      .addCase(getCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 Change Quantity
      .addCase(changeCartQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(changeCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ❌ Remove Product
      .addCase(removeProductFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(removeProductFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const cartReducer = cartSlice.reducer;
