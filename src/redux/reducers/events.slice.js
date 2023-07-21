import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchData, { postData } from "../../helper/apiCall";

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const response = await fetchData("/events");
  return response;
});

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (event) => {
    const response = await postData("/events", event);
    return response;
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState: { loading: false, error: null, data: [], success: null },
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
      });
  },
});

export default eventsSlice.reducer;
