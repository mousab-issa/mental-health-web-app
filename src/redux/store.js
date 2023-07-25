import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootSlice";
import appointmentsReducer from "./reducers/appointment.slice";
import events from "./reducers/events.slice";
import tracks from "./reducers/tracks.slice";
import auth from "./reducers/auth.slice";
import blog from "./reducers/blog.slice";

const store = configureStore({
  reducer: {
    root: rootReducer,
    appointment: appointmentsReducer,
    event: events,
    track: tracks,
    auth,
    blog,
  },
});

export default store;
