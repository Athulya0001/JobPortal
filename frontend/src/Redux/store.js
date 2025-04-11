import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Reducers/authSlice';
import jobReducer from './Reducers/jobSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
  },
});

export default store;