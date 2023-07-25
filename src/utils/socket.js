import { io } from "socket.io-client";

const URL = process.env.SOCKET_SERVER;

export const socket = io(URL);
