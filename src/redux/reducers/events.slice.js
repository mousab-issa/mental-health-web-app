import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchData, { postData, putData, deleteData } from "../../helper/apiCall";

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (page = 1, limit = 10) => {
    const response = await fetchData(`/events?page=${page}&limit=${limit}`);
    return response;
  }
);

export const fetchEvent = createAsyncThunk("events/fetchEvent", async (id) => {
  const response = await fetchData(`/events/${id}`);
  return response;
});

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (event) => {
    const response = await postData("/events", event);
    return response;
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, event }) => {
    const response = await putData(`/events/${id}`, event);
    return response;
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id) => {
    const response = await deleteData(`/events/${id}`);
    return response;
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    loading: false,
    error: null,
    data: [],
    currentEvent: null,
    success: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createEvent.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
        state.success = "Event created successfully";
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.data.findIndex(
          (event) => event._id === action.payload._id
        );
        if (idx !== -1) {
          state.data[idx] = action.payload;
        }
        state.success = "Event updated successfully";
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(
          (event) => event._id !== action.payload._id
        );
        state.success = "Event deleted successfully";
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default eventsSlice.reducer;
