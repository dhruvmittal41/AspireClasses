// src/app/store.js
import { configureStore } from '@reduxjs/toolkit'
import dataReducer from '../features/data/AdminSlice'
import tetstReducer from '../features/data/testsSlice'
import monitorReducer from '../features/data/monitorSlice'
import questionsReducer from '../features/data/questionsSlice'

export const store = configureStore({
  reducer: {
    data: dataReducer,
    tests: tetstReducer,
    monitor: monitorReducer,
    questions: questionsReducer,
  },
});
