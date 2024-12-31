import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
const Base_Url = import.meta.env.VITE_BASE_URL;
// Async thunk for uploading the batch Excel file
export const BatchExcelFileUpload = createAsyncThunk(
  "batchExcel/BatchExcelFileUpload",
  async (file, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        `${Base_Url}/api/excel/upload/batchfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for fetching batch data
export const batchFetchExcelData = createAsyncThunk(
  "batchExcel/batchFetchExcelData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Base_Url}/api/excel/data/batchfile`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting the batch Excel file
export const DeleteBatchExcelFile = createAsyncThunk(
  "batchExcel/DeleteBatchExcelFile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${Base_Url}/api/excel/batch-delete`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice for managing the batch Excel file upload and data fetching state
const BatchExcelData = createSlice({
  name: "batchExcel",
  initialState: {
    BatchExcelFileUpload: { data: null, loading: false, error: null },
    batchFetchedData: { data: [], loading: false, error: null },
    DeleteBatchExcelFile: { data: null, loading: false, error: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handling BatchExcelFileUpload thunks
    builder
      .addCase(BatchExcelFileUpload.pending, (state) => {
        state.BatchExcelFileUpload.loading = true;
        state.BatchExcelFileUpload.error = null;
      })
      .addCase(BatchExcelFileUpload.fulfilled, (state, action) => {
        state.BatchExcelFileUpload.loading = false;
        state.BatchExcelFileUpload.data = action.payload;
        state.BatchExcelFileUpload.error = null;
        // Notify on success
        Swal.fire({
          title: "Success",
          text: action.payload.message || "File uploaded successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .addCase(BatchExcelFileUpload.rejected, (state, action) => {
        state.BatchExcelFileUpload.loading = false;
        state.BatchExcelFileUpload.error = action.payload;
        // Notify on error
        Swal.fire({
          title: "Error",
          text: action.payload || "An error occurred while uploading the file.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });

    // Handling batchFetchExcelData thunks
    builder
      .addCase(batchFetchExcelData.pending, (state) => {
        state.batchFetchedData.loading = true;
        state.batchFetchedData.error = null;
      })
      .addCase(batchFetchExcelData.fulfilled, (state, action) => {
        state.batchFetchedData.loading = false;
        state.batchFetchedData.data = action.payload;
        state.batchFetchedData.error = null;
      })
      .addCase(batchFetchExcelData.rejected, (state, action) => {
        state.batchFetchedData.loading = false;
        state.batchFetchedData.error = action.payload;
      });

    // Handling DeleteBatchExcelFile thunks
    builder
      .addCase(DeleteBatchExcelFile.pending, (state) => {
        state.DeleteBatchExcelFile.loading = true;
        state.DeleteBatchExcelFile.error = null;
      })
      .addCase(DeleteBatchExcelFile.fulfilled, (state, action) => {
        state.DeleteBatchExcelFile.loading = false;
        state.DeleteBatchExcelFile.data = action.payload;
        state.DeleteBatchExcelFile.error = null;
        // Notify on success
        Swal.fire({
          title: "Success",
          text: action.payload.message || "Batch file deleted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .addCase(DeleteBatchExcelFile.rejected, (state, action) => {
        state.DeleteBatchExcelFile.loading = false;
        state.DeleteBatchExcelFile.error = action.payload;
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

export const batchExcelReducer = BatchExcelData.reducer;
