import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Base_Url}/api/auth/login`, {
        email,
        password,
      });
      
      return response.data; // Expecting { user, token, isVerified }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Login slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isVerified: null, // New state to track verification status
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isVerified = null; // Reset verification status on logout
      localStorage.removeItem("token"); // Optionally, clear token from localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      // Login pending state
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Login fulfilled (successful)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Update with the user data
        state.token = action.payload.token; // Save the token
        state.isVerified = action.payload.isVerified; // Save verification status
        state.error = null;

        if (!state.isVerified) {
          Swal.fire({
            title: "Verification Required",
            text: "Your email is not verified. Please check your email for verification instructions.",
            icon: "warning",
            confirmButtonText: "OK",
          });
          return; // Exit the function to prevent further actions
        }

        Swal.fire({
          title: "Success",
          text: "Login successful!",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Optionally, save the token to localStorage
        localStorage.setItem("token", action.payload.token);
      })
      // Login rejected (failed)
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        Swal.fire({
          title: "Error",
          text: action.payload || "Login failed! Please check your credentials.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
