import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchData, { deleteData, postData, putData } from "../../helper/apiCall";

export const fetchTracks = createAsyncThunk(
  "tracks/fetchTracks",
  async (page = 1) => {
    const response = await fetchData(`/tracks?page=${page}&limit=10`);
    return response.data;
  }
);

export const fetchTrackById = createAsyncThunk(
  "track/fetchById",
  async (trackId) => {
    const response = await fetchData(`/tracks/${trackId}`);
    return response.data;
  }
);

export const createTrack = createAsyncThunk(
  "tracks/createTrack",
  async (track) => {
    const response = await postData("/tracks", track);
    return response.data;
  }
);

export const deleteTrack = createAsyncThunk(
  "tracks/deleteTrack",
  async (id) => {
    const response = await deleteData(`/tracks/${id}`);
    return response.data;
  }
);

export const updateTrack = createAsyncThunk(
  "tracks/updateTrack",
  async ({ id, track }) => {
    const response = await putData(`/tracks/${id}`, track);
    return response.data;
  }
);

const tracksSlice = createSlice({
  name: "tracks",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrack.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.loading = false;
      })
      .addCase(createTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrack.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (track) => track._id !== action.payload._id
        );
        state.loading = false;
      })
      .addCase(deleteTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrack.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (track) => track._id === action.payload._id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTrackById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrackById.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (track) => track._id === action.payload._id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        } else {
          state.data.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(fetchTrackById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default tracksSlice.reducer;
