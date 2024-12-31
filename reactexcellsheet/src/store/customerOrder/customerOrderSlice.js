import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
const Base_Url = import.meta.env.VITE_BASE_URL;
// Async Thunks
export const CustomerUploadFile = createAsyncThunk(
  "customerExcel/CustomerUploadFile",
  async (file, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        `${Base_Url}/api/excel/upload/customer-order`,
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

export const getCustomerExcelData = createAsyncThunk(
  "customerExcel/getCustomerExcelData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${Base_Url}/api/excel/data/customer-sucess-order`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCustomerPendingData = createAsyncThunk(
  "customerExcel/getCustomerPendingData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${Base_Url}/api/excel/data/customer-pending-order`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCustomervalueMismatchdata = createAsyncThunk(
  "customerExcel/getCustomervalueMismatchdata",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${Base_Url}/api/excel/data/customer-mismatch-value`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCustomerOutOfstocksOrder = createAsyncThunk(
  "customerExcel/getCustomerOutOfstocksOrder",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${Base_Url}/api/excel/data/customer-outofsyocks-order`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const postorderFilewithArticleType = createAsyncThunk(
  "customerExcel/postorderFilewithArticleType",
  async ({ file, articleType }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${Base_Url}/api/excel/upload/customer-order/${articleType}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const DeleteOrderFile = createAsyncThunk(
  "customerExcel/DeleteOrderFile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${Base_Url}/api/excel/orderfile/deleteorderfile`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const CustomerOrderExcel = createSlice({
  name: "customerExcel",
  initialState: {
    CustomerUploadFile: { data: null, loading: false, error: null },
    getCustomerExcelData: { data: [], loading: false, error: null },
    getCustomerOutOfstocksOrder: { data: [], loading: false, error: null },
    getCustomervalueMismatchdata: { data: [], loading: false, error: null },
    getCustomerPendingData: { data: [], loading: false, error: null },
    postorderFilewithArticleType: { data: null, loading: false, error: null },
    DeleteOrderFile: { data: null, loading: false, error: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    // POST CUSTOMER ORDER FILE
    builder
      .addCase(CustomerUploadFile.pending, (state) => {
        state.CustomerUploadFile.loading = true;
        state.CustomerUploadFile.error = null;
      })
      .addCase(CustomerUploadFile.fulfilled, (state, action) => {
        state.CustomerUploadFile.loading = false;
        state.CustomerUploadFile.data = action.payload;
        Swal.fire({
          title: "Success",
          text: action.payload.message || "Order File uploaded successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .addCase(CustomerUploadFile.rejected, (state, action) => {
        state.CustomerUploadFile.loading = false;
        state.CustomerUploadFile.error = action.payload;
        Swal.fire({
          title: "Error",
          text: action.payload || "Error uploading file",
          icon: "error",
          confirmButtonText: "OK",
        });
      });

    // GET CUSTOMER FILE
    builder
      .addCase(getCustomerExcelData.pending, (state) => {
        state.getCustomerExcelData.error = null;
        state.getCustomerExcelData.loading = true;
      })
      .addCase(getCustomerExcelData.fulfilled, (state, action) => {
        state.getCustomerExcelData.loading = false;
        state.getCustomerExcelData.data = action.payload;
        state.getCustomerExcelData.error = null;
      })
      .addCase(getCustomerExcelData.rejected, (state, action) => {
        state.getCustomerExcelData.error = action.payload;
        state.getCustomerExcelData.loading = false;
      });

    // GET CUSTOMER OUT OF STOCKS ORDER
    builder
      .addCase(getCustomerOutOfstocksOrder.pending, (state) => {
        state.getCustomerOutOfstocksOrder.loading = true;
        state.getCustomerOutOfstocksOrder.error = null;
      })
      .addCase(getCustomerOutOfstocksOrder.fulfilled, (state, action) => {
        state.getCustomerOutOfstocksOrder.data = action.payload;
        state.getCustomerOutOfstocksOrder.loading = false;
        state.getCustomerOutOfstocksOrder.error = null;
      })
      .addCase(getCustomerOutOfstocksOrder.rejected, (state, action) => {
        state.getCustomerOutOfstocksOrder.loading = false;
        state.getCustomerOutOfstocksOrder.error = action.payload;
      });

    // GET CUSTOMER VALUE MISMATCH
    builder
      .addCase(getCustomervalueMismatchdata.pending, (state) => {
        state.getCustomervalueMismatchdata.error = null;
        state.getCustomervalueMismatchdata.loading = true;
      })
      .addCase(getCustomervalueMismatchdata.fulfilled, (state, action) => {
        state.getCustomervalueMismatchdata.loading = false;
        state.getCustomervalueMismatchdata.data = action.payload;
        state.getCustomervalueMismatchdata.error = null;
      })
      .addCase(getCustomervalueMismatchdata.rejected, (state, action) => {
        state.getCustomervalueMismatchdata.error = action.payload;
        state.getCustomervalueMismatchdata.loading = false;
      });

    // GET CUSTOMER PENDING DATA
    builder
      .addCase(getCustomerPendingData.pending, (state) => {
        state.getCustomerPendingData.error = null;
        state.getCustomerPendingData.loading = true;
      })
      .addCase(getCustomerPendingData.fulfilled, (state, action) => {
        state.getCustomerPendingData.loading = false;
        state.getCustomerPendingData.data = action.payload;
        state.getCustomerPendingData.error = null;
      })
      .addCase(getCustomerPendingData.rejected, (state, action) => {
        state.getCustomerPendingData.error = action.payload;
        state.getCustomerPendingData.loading = false;
      });

    // POST ORDER FILE WITH ARTICLE TYPE
    builder
      .addCase(postorderFilewithArticleType.pending, (state) => {
        state.postorderFilewithArticleType.loading = true;
        state.postorderFilewithArticleType.error = null;
      })
      .addCase(postorderFilewithArticleType.fulfilled, (state, action) => {
        state.postorderFilewithArticleType.loading = false;
        state.postorderFilewithArticleType.data = action.payload;
      })
      .addCase(postorderFilewithArticleType.rejected, (state, action) => {
        state.postorderFilewithArticleType.loading = false;
        state.postorderFilewithArticleType.error = action.payload;
      });

    // DELETE ALL ORDER FILE
    builder
      .addCase(DeleteOrderFile.pending, (state) => {
        state.DeleteOrderFile.loading = true;
        state.DeleteOrderFile.error = null;
      })
      .addCase(DeleteOrderFile.fulfilled, (state, action) => {
        state.DeleteOrderFile.loading = false;
        state.DeleteOrderFile.data = action.payload;
        state.DeleteOrderFile.error = null;
        Swal.fire({
          title: "Success",
          text: action.payload.message || "All order files deleted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .addCase(DeleteOrderFile.rejected, (state, action) => {
        state.DeleteOrderFile.loading = false;
        state.DeleteOrderFile.error = action.payload;
        Swal.fire({
          title: "Error",
          text: action.payload || "Error deleting files",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  },
});

export const CustomerOrderReducer = CustomerOrderExcel.reducer;
