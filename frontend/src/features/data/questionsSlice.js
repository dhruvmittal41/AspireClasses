import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";



export const fetchTests = createAsyncThunk(
  "questions/fetchTests",
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

export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async (testId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/tests/${testId}/questions`);
      return res.data.map((q) => ({
        ...q,
        options:
          typeof q.options === "string" ? JSON.parse(q.options) : q.options,
        marks: q.marks || 1,
      }));
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return rejectWithValue("Failed to fetch questions");
    }
  }
);

export const addQuestion = createAsyncThunk(
  "questions/addQuestion",
  async ({ testId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/tests/${testId}/questions`, payload);
      return { ...res.data.question, ...payload };
    } catch {
      return rejectWithValue("Failed to add question");
    }
  }
);

export const updateQuestion = createAsyncThunk(
  "questions/updateQuestion",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/api/questions/${id}`, data);
      return { id, data };
    } catch {
      return rejectWithValue("Failed to update question");
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  "questions/deleteQuestion",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/questions/${id}`);
      return id;
    } catch {
      return rejectWithValue("Failed to delete question");
    }
  }
);


const questionsSlice = createSlice({
  name: "questions",
  initialState: {
    tests: [],
    questions: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearQuestions(state) {
      state.questions = [];
    },
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchTests.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchTests.fulfilled, (s, a) => {
        s.loading = false;
        s.tests = a.payload;
      })
      .addCase(fetchTests.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

     
      .addCase(fetchQuestions.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchQuestions.fulfilled, (s, a) => {
        s.loading = false;
        s.questions = a.payload;
      })
      .addCase(fetchQuestions.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      
      .addCase(addQuestion.fulfilled, (s, a) => {
        s.questions.push(a.payload);
      })

      
      .addCase(updateQuestion.fulfilled, (s, a) => {
        const idx = s.questions.findIndex(q => q.id === a.payload.id);
        if (idx !== -1) {
          s.questions[idx] = { ...s.questions[idx], ...a.payload.data };
        }
      })

      
      .addCase(deleteQuestion.fulfilled, (s, a) => {
        s.questions = s.questions.filter(q => q.id !== a.payload);
      });
  },
});

export const { clearQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;
