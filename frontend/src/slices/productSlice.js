import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProducts,
  fetchProductDetails,
  adminFetchProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminFetchAllReviews,
  adminDeleteReview,
} from "../actions/productAction";

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    filteredProducts: [],
    productDetails: null,
    reviews: [],
    status: "idle",
    error: null,
    successMessage: null,
  },
  reducers: {
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🛒 User fetch
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.filteredProducts = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // 🧾 Product details
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.productDetails = action.payload;
      })

      // 👑 Admin
      .addCase(adminFetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(adminCreateProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.successMessage = "Product created successfully!";
      })
      .addCase(adminUpdateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
        state.successMessage = "Product updated successfully!";
      })
      .addCase(adminDeleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
        state.successMessage = "Product deleted successfully!";
      })
      .addCase(adminFetchAllReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(adminDeleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r._id !== action.payload);
        state.successMessage = "Review deleted successfully!";
      })
      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { setFilteredProducts, clearSuccess, clearError } = productSlice.actions;
export default productSlice.reducer;
