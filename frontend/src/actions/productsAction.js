// src/actions/productsAction.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/products"); // backend endpoint
      return data.products; // adjust if backend sends differently
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
