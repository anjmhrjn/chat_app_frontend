import { io, Socket } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    console.log("i am inside")
    const token = localStorage.getItem("token");
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080", {
      auth: { token: token },
    });
  }
  return socket;
};
