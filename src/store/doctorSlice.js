import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

export const fetchDoctors = createAsyncThunk('doctors/fetchDoctors', async ({page,limit,search}, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`admin/doctor/list?page=${page}&limit=${limit}&search=${search}`);
    return response.data.response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.response?.message || error.message);
  }
});

export const registerDoctor = createAsyncThunk('doctors/registerDoctor', async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('admin/doctor/register', formData);
    return response.data.response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.response?.message || error.message);
  }
});

export const updateDoctor = createAsyncThunk('doctors/updateDoctor', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`admin/doctor/update/${id}`, formData);
    return response.data.response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.response?.message || error.message);
  }
});

export const deleteDoctor = createAsyncThunk('doctors/deleteDoctor', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`admin/doctor/delete/${id}`);
    return id; // Return ID to update the state after deletion
  } catch (error) {
    return rejectWithValue(error.response?.data?.response?.message || error.message);
  }
});

// Doctor slice
const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {}, // No synchronous reducers needed here
  extraReducers: (builder) => {
    builder
      // Fetch doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.doctorList;
        state.total = action.payload.doctorCount;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register doctor
      .addCase(registerDoctor.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(registerDoctor.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update doctor
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const index = state.list.findIndex((doc) => doc._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete doctor
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.list = state.list.filter((doc) => doc._id !== action.payload);
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default doctorSlice.reducer;
