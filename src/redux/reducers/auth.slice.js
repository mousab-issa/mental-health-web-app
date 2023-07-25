import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import jwt_decode from "jwt-decode";
import fetchData, { postData } from "../../helper/apiCall";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (user, thunkAPI) => {
    try {
      const response = await postData("/user/login", user);

      await localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (token, thunkAPI) => {
    try {
      const response = await postData("/user/refreshToken", { token });

      await localStorage.setItem("token", response.data.accessToken);

      return response.data;
    } catch (error) {
      console.log("ERROR", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logoutUser",
  async (user, thunkAPI) => {
    try {
      await localStorage.removeItem("token");

      return {};
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
      await localStorage.removeItem("token");
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user, thunkAPI) => {
    try {
      const response = await postData("/user/register", user);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
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
      state.user = jwt_decode(payload.token);
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.status = "failed";

      state.error = payload.error;
    },
    [refreshToken.pending]: (state) => {
      state.status = "loading";
    },
    [refreshToken.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      state.user = jwt_decode(payload.accessToken);
    },
    [refreshToken.rejected]: (state, { payload }) => {
      state.status = "idle";

      state.error = payload.error;
    },
    [getUserInfo.pending]: (state) => {
      state.status = "loading";
    },
    [getUserInfo.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      state.user = payload;
    },
    [getUserInfo.rejected]: (state, { payload }) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    [registerUser.pending]: (state) => {
      state.status = "loading";
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.status = "idle";
      state.error = payload.error;
    },
    [logout.fulfilled]: (state, { payload }) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    [logout.pending]: (state, { payload }) => {
      state.status = "idle";
    },
  },
});

export default authSlice.reducer;
