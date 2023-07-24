import "./styles/app.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import { Protected, Public, Admin } from "./middleware/route";
import React, { lazy, Suspense, useEffect } from "react";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Track from "./pages/Track";
import { useDispatch } from "react-redux";
import { getUserInfo, logout } from "./redux/reducers/auth.slice";
import jwt_decode from "jwt-decode";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Doctors = lazy(() => import("./pages/Doctors"));
const Profile = lazy(() => import("./pages/Profile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const ApplyDoctor = lazy(() => import("./pages/ApplyDoctor"));
const Error = lazy(() => import("./pages/Error"));
const AppointmentChat = lazy(() => import("./pages/AppointmentChat"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      dispatch(getUserInfo(decodedToken.userId));
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Toaster />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/register"
            element={
              <Public>
                <Register />
              </Public>
            }
          />

          <Route path="/" element={<Home />} />

          <Route path="/doctors" element={<Doctors />} />

          <Route
            path="/appointments"
            element={
              <Protected>
                <Appointments />
              </Protected>
            }
          />

          <Route
            path="/notifications"
            element={
              <Protected>
                <Notifications />
              </Protected>
            }
          />

          <Route
            path="/applyfordoctor"
            element={
              <Protected>
                <ApplyDoctor />
              </Protected>
            }
          />

          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />

          <Route
            path="/dashboard/users"
            element={
              <Admin>
                <Dashboard type={"users"} />
              </Admin>
            }
          />

          <Route
            path="/tracks/:trackId"
            element={
              <Protected>
                <Track />
              </Protected>
            }
          />

          <Route
            path="/dashboard/doctors"
            element={
              <Admin>
                <Dashboard type={"doctors"} />
              </Admin>
            }
          />

          <Route
            path="/dashboard/events"
            element={
              <Admin>
                <Dashboard type={"events"} />
              </Admin>
            }
          />

          <Route
            path="/dashboard/appointments"
            element={
              <Protected>
                <Dashboard type={"appointments"} />
              </Protected>
            }
          />

          <Route
            path="/dashboard/tracks"
            element={
              <Protected>
                <Dashboard type={"tracks"} />
              </Protected>
            }
          />

          <Route
            path="/appointment/:appointmentId/chat"
            element={
              <Protected>
                <AppointmentChat />
              </Protected>
            }
          />

          <Route
            path="/dashboard/applications"
            element={
              <Protected>
                <Dashboard type={"applications"} />
              </Protected>
            }
          />

          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;
