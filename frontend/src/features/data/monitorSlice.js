import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";




export const fetchMonitorTests = createAsyncThunk(
  "monitor/fetchTests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/admin/tests");
      return res.data;
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return rejectWithValue("Failed to load tests");
    }
  }
);


export const fetchTestMonitor = createAsyncThunk(
  "monitor/fetchTestMonitor",
  async (testId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/admin/tests/${testId}/monitor`);
      return res.data;
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return rejectWithValue("Failed to load test monitor");
    }
  }
);



const monitorSlice = createSlice({
  name: "monitor",
  initialState: {
    tests: [],
    users: [],
    loadingTests: false,
    loadingUsers: false,
    error: null,
  },
  reducers: {
    clearMonitorUsers: (state) => {
      state.users = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchMonitorTests.pending, (state) => {
        state.loadingTests = true;
        state.error = null;
      })
      .addCase(fetchMonitorTests.fulfilled, (state, action) => {
        state.loadingTests = false;
        state.tests = action.payload;
      })
      .addCase(fetchMonitorTests.rejected, (state, action) => {
        state.loadingTests = false;
        state.error = action.payload;
      })

    
      .addCase(fetchTestMonitor.pending, (state) => {
        state.loadingUsers = true;
        state.error = null;
      })
      .addCase(fetchTestMonitor.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = action.payload;
      })
      .addCase(fetchTestMonitor.rejected, (state, action) => {
        state.loadingUsers = false;
        state.error = action.payload;
      });
  },
});

export const { clearMonitorUsers } = monitorSlice.actions;
export default monitorSlice.reducer;
