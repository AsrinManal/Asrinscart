import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import userReducer from "./slices/userSlice";
import { cartReducer } from "./slices/cartslice"; // ✅ correct

// ============================
// Redux Store Configuration
// ============================

export const store = configureStore({
  reducer: {
    products: productReducer,
    user: userReducer,
    cart: cartReducer, // ✅ Cart state
  },
  devTools: true, // Optional: Enables Redux DevTools in browser
});


export default store;