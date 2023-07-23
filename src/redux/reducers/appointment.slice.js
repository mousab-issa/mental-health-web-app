import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import jwt_decode from "jwt-decode";
import fetchData, { putData } from "../../helper/apiCall";
import { toast } from "react-hot-toast";

const initialState = {
  appointments: [],
  status: "idle",
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async () => {
    const { userId } = jwt_decode(localStorage.getItem("token"));
    const response = await fetchData(
      `/appointment/getallappointments?search=${userId}`
    );

    return response;
  }
);

export const completeAppointment = createAsyncThunk(
  "appointments/completeAppointment",
  async (appointment, thunk) => {
    try {
      await toast.promise(
        putData(
          "/appointment/completed",
          {
            appointid: appointment._id,
            doctorId: appointment.doctorId._id,
            doctorname: `${appointment.userId.firstname} ${appointment.userId.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment Completed successfully",
          error: "Unable to Complete",
          loading: "Completing appointment...",
        }
      );
      return { ...appointment, status: "Completed" };
    } catch (error) {
      thunk.rejectWithValue(error);
    }
  }
);

export const acceptAppointment = createAsyncThunk(
  "appointments/acceptAppointment",
  async (appointment, thunk) => {
    try {
      await toast.promise(
        putData(
          "/appointment/accept",
          {
            appointid: appointment._id,
            doctorId: appointment.doctorId._id,
            doctorname: `${appointment.userId.firstname} ${appointment.userId.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment Accepted successfully",
          error: "Unable to Accepted",
          loading: "Accepting appointment...",
        }
      );

      return { ...appointment, status: "Accepted" };
    } catch (error) {
      thunk.rejectWithValue(error);
    }
  }
);

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(completeAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.map((appointment) =>
          appointment._id === action.payload._id ? action.payload : appointment
        );
      })
      .addCase(acceptAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.map((appointment) =>
          appointment._id === action.payload._id ? action.payload : appointment
        );
      });
  },
});

export default appointmentsSlice.reducer;
