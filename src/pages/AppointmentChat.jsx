import React from "react";
import Chat from "../components/Chat";
import { useParams } from "react-router-dom";

function AppointmentChat() {
  const params = useParams();

  return <Chat chatId={params.appointmentId} />;
}
export default AppointmentChat;
