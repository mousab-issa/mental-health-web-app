import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import jwt_decode from "jwt-decode";
import fetchData, { putData } from "../../helper/apiCall";

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
  async (appointment) => {
    console.log(appointment);
    const response = await putData(
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
    );
    return response;
  }
);

export const acceptAppointment = createAsyncThunk(
  "appointments/acceptAppointment",
  async (appointment) => {
    const response = await putData(
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
    );
    return response;
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
        console.log(action.payload);
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
