// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';
export const toast=(toaster,message,status)=>{
  toaster({
    title: message,
    description:'',
    status: status,
    position:'top-right',
    duration: 5000,
    isClosable: true,
  });
}
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const role= localStorage.getItem('userRole') || null
    const response = await axiosInstance.post(role==='admin'?'admin/login':(role==='doctor'?'doctor/login':'staff/login'), credentials);
    return response.data.response.data; 
  } catch (error) {
    return rejectWithValue(error.response?.data?.response?.message || 'An error occurred');
  }
});

export const signup = createAsyncThunk('auth/signup', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('admin/register', credentials);
    return response.data.response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.response?.message || 'An error occurred');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/admin/forgot-password', { email });
    return response.data.response.data; ;
  } catch (error) {
    return rejectWithValue(error.response?.data?.response?.message || 'An error occurred');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/admin/reset-password', data);
    return response.data.response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.response?.message || 'An error occurred');
  }
});
export const changePassword = createAsyncThunk('auth/changePassword', async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/admin/change-password', data);
    return response.data.response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.response?.message || 'An error occurred');
  }
});
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || null; 
    
      const response = await axiosInstance.put('/admin/update/'+user?._id, data);
      return response.data.response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.response?.message || 'An error occurred');
    }
  }
);
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
      localStorage.removeItem('user');
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
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => { state.status = 'loading'; })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
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
      })
      .addCase(changePassword.pending, (state) => { state.status = 'loading'; })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => { state.status = 'loading'; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user={...state?.user,...action?.payload};
        localStorage.setItem('user', JSON.stringify({...state?.user,...action?.payload}));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});
export const { setRole, logout,resetAuth } = authSlice.actions;
export default authSlice.reducer;
