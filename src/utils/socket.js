import { io } from "socket.io-client";

const URL = "https://mental-health-backend-26w3.onrender.com";

export const socket = io(URL);
