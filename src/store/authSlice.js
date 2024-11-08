// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    return response.data;  // Return the response data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const signup = createAsyncThunk('auth/signup', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/auth/signup', credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/auth/reset-password', data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    roles:['admin','doctor','staff'],
    role: localStorage.getItem('userRole') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem('userRole', action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    },
    resetAuth: (state) => {
      state.user = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.status = 'loading'; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => { state.status = 'loading'; })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        localStorage.setItem('user', action.payload);
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => { state.status = 'loading'; })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => { state.status = 'loading'; })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});
export const { setRole, logout,resetAuth } = authSlice.actions;
export default authSlice.reducer;
