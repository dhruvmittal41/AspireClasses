import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


export const fetchTestById = createAsyncThunk(
  "tests/fetchById",
  async (testId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/tests/${testId}`);
      return res.data;
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return rejectWithValue("Failed to load test details.");
    }
  }
);


export const createTest = createAsyncThunk(
  "tests/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/tests", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create test."
      );
    }
  }
);


export const updateTest = createAsyncThunk(
  "tests/update",
  async ({ testId, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/tests/${testId}`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update test."
      );
    }
  }
);

export const fetchTests = createAsyncThunk(
  "tests/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/tests");
      return res.data;
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return rejectWithValue("Failed to fetch tests");
    }
  }
);



const testsSlice = createSlice({
  name: "tests",
  initialState: {
    testsList: [],
    currentTest: null,
    loading: false,
    submitting: false,
    error: "",
    success: "",
  },
  reducers: {
    clearTestState: (state) => {
      state.error = "";
      state.success = "";
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchTestById.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchTestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTest = action.payload;
      })
      .addCase(fetchTestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(createTest.pending, (state) => {
        state.submitting = true;
        state.error = "";
      })
      .addCase(createTest.fulfilled, (state) => {
        state.submitting = false;
        state.success = "Test created successfully!";
      })
      .addCase(createTest.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      
      .addCase(updateTest.pending, (state) => {
        state.submitting = true;
        state.error = "";
      })
      .addCase(updateTest.fulfilled, (state) => {
        state.submitting = false;
        state.success = "Test updated successfully!";
      })
      .addCase(updateTest.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false;
        state.testsList = action.payload;
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTestState } = testsSlice.actions;
export default testsSlice.reducer;
