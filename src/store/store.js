import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import doctorReducer from './doctorSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
  },
});

export default store;
