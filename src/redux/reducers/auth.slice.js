import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import jwt_decode from "jwt-decode";
import fetchData from "../../helper/apiCall";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (user, thunkAPI) => {
    try {
      const response = await axios.post("/user/login", user);

      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "auth/getUserInfo",
  async (userId, thunkAPI) => {
    try {
      const response = await fetchData(`/user/getuser/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user, thunkAPI) => {
    try {
      const response = await axios.post("/user/register", user);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: {
    [loginUser.pending]: (state) => {
      state.status = "loading";
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";

      state.user = jwt_decode(payload.token).userId;
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.error = payload.error;
      toast.error(payload.error);
    },
    [getUserInfo.pending]: (state) => {
      state.status = "loading";
    },
    [getUserInfo.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      state.user = payload;
    },
    [getUserInfo.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.error = payload.error;
      toast.error(payload.error);
    },
    [registerUser.pending]: (state) => {
      state.status = "loading";
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      toast.success("User registered successfully");
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.error = payload.error;
      toast.error(payload.error);
    },
  },
});

export default authSlice.reducer;
