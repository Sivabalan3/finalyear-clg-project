import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Base_Url = import.meta.env.VITE_BASE_URL;
// Thunk to handle login API call
export const loginAction = createAsyncThunk(
  "auth/login",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Base_Url}/api/auth/login`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    Login: { data: null, error: null, loading: false },
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle the login lifecycle
    builder
      .addCase(loginAction.pending, (state) => {
        state.Login.loading = true;
        state.Login.error = null;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.Login.loading = false;
        state.Login.data = action.payload;
        state.Login.error = null;
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.Login.loading = false;
        state.Login.error = action.payload;
      });
  },
});
export const authReducer = authSlice.reducer;
