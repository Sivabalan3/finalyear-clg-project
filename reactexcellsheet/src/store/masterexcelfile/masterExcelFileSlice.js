import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
const Base_Url = import.meta.env.VITE_BASE_URL;
// Async thunk for uploading the master Excel file
export const MasterExcelFileUpload = createAsyncThunk(
  "masterExcel/MasterExcelFileUpload",
  async (file, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${Base_Url}/api/excel/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for fetching data
export const fetchExcelData = createAsyncThunk(
  "masterExcel/fetchExcelData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Base_Url}/api/excel/data`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for deleting the master Excel file
export const DeleteMasterFile = createAsyncThunk(
  "masterExcel/DeleteMasterFile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${Base_Url}/api/excel/master-delete`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice for managing the master Excel file upload, data fetching, and deletion state
const MasterExcelData = createSlice({
  name: "masterExcel",
  initialState: {
    MasterExcelFileUpload: { data: null, loading: false, error: null },
    fetchedData: { data: [], loading: false, error: null },
    DeleteMasterFile: { data: null, loading: false, error: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handling MasterExcelFileUpload thunks
    builder
      .addCase(MasterExcelFileUpload.pending, (state) => {
        state.MasterExcelFileUpload.loading = true;
        state.MasterExcelFileUpload.error = null;
      })
      .addCase(MasterExcelFileUpload.fulfilled, (state, action) => {
        state.MasterExcelFileUpload.loading = false;
        state.MasterExcelFileUpload.data = action.payload;
        state.MasterExcelFileUpload.error = null;
        // Notify on success
        Swal.fire({
          title: "Success",
          text: action.payload.message || "File uploaded successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .addCase(MasterExcelFileUpload.rejected, (state, action) => {
        state.MasterExcelFileUpload.loading = false;
        state.MasterExcelFileUpload.error = action.payload;
        // Notify on error
        Swal.fire({
          title: "Error",
          text: action.payload || "Error uploading file",
          icon: "error",
          confirmButtonText: "OK",
        });
      });

    // Handling fetchExcelData thunks
    builder
      .addCase(fetchExcelData.pending, (state) => {
        state.fetchedData.loading = true;
        state.fetchedData.error = null;
      })
      .addCase(fetchExcelData.fulfilled, (state, action) => {
        state.fetchedData.loading = false;
        state.fetchedData.data = action.payload;
        state.fetchedData.error = null;
      })
      .addCase(fetchExcelData.rejected, (state, action) => {
        state.fetchedData.loading = false;
        state.fetchedData.error = action.payload;
      });

    // Handling DeleteMasterFile thunks
    builder
      .addCase(DeleteMasterFile.pending, (state) => {
        state.DeleteMasterFile.loading = true;
        state.DeleteMasterFile.error = null;
      })
      .addCase(DeleteMasterFile.fulfilled, (state, action) => {
        state.DeleteMasterFile.loading = false;
        state.DeleteMasterFile.data = action.payload;
        state.DeleteMasterFile.error = null;
        // Notify on success
        Swal.fire({
          title: "Success",
          text: action.payload.message || "File deleted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .addCase(DeleteMasterFile.rejected, (state, action) => {
        state.DeleteMasterFile.loading = false;
        state.DeleteMasterFile.error = action.payload;
        // Notify on error
        Swal.fire({
          title: "Error",
          text: action.payload || "Error deleting file",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  },
});

export const masterExcelReducer = MasterExcelData.reducer;
