import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios"; // your axios instance

export const fetchUsersAndTests = createAsyncThunk(
  "data/fetchUsersAndTests",
  async (_, { rejectWithValue }) => {
    try {
      const [usersResponse, testsResponse] = await Promise.all([
        api.get("/api/user/all"),
        api.get("/api/tests"),
      ]);

      return {
        users: usersResponse.data || [],
        tests: testsResponse.data || [],
      };
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return rejectWithValue("Failed to fetch data. Please try again later.");
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState: {
    users: [],
    tests: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAndTests.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUsersAndTests.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.tests = action.payload.tests;
      })
      .addCase(fetchUsersAndTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dataSlice.reducer;
