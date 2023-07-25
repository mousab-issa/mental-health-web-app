import React from "react";
import AdminApplications from "../components/AdminApplications";
import AdminAppointments from "../components/AdminAppointments";
import AdminDoctors from "../components/AdminDoctors";
import Sidebar from "../components/Sidebar";
import Users from "../components/Users";
import AdminEvents from "../components/AdminEvents";
import AdminTracks from "../components/AdminTracks";
import AdminBlog from "../components/AdminBlogs";

const Dashboard = (props) => {
  const { type } = props;

  const renderContent = () => {
    switch (type) {
      case "users":
        return <Users />;
      case "doctors":
        return <AdminDoctors />;
      case "applications":
        return <AdminApplications />;
      case "appointments":
        return <AdminAppointments />;
      case "events":
        return <AdminEvents />;
      case "tracks":
        return <AdminTracks />;
      case "blogs":
        return <AdminBlog />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <section className="layout-section">
        <div className="layout-container">
          <Sidebar />
          {renderContent()}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
