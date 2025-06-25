"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const SocketContext = createContext();

let socket;

export function SocketProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedToken = localStorage.getItem("token");
    if (!socket) {
      socket = io(
        process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080",
        {
          autoConnect: false,
          auth: { token: savedToken },
        }
      );
    }
    socket.connect();

    if (savedToken) {
      const decoded = jwtDecode(savedToken);
      setToken(savedToken);
      setUserInfo({ guestId: decoded?.guestId, username: decoded?.username });
      scheduleTokenRefresh(decoded?.exp);
    }

    // Listen for tokenIssued from server
    socket.on("tokenIssued", ({ token, userInfo }) => {
      const decoded = jwtDecode(token);
      setToken(token);
      setUserInfo(userInfo);
      localStorage.setItem("token", token);
      scheduleTokenRefresh(decoded?.exp);
    });

    setIsSocketReady(true);

    return () => {
      socket.off("tokenIssued");
    };
  }, []);

  const scheduleTokenRefresh = (exp) => {
    const refreshTime = exp * 1000 - 5 * 60 * 1000 - Date.now();
    if (refreshTime > 0) {
      setTimeout(() => {
        socket.emit("refreshTokenRequest");
      }, refreshTime);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, userInfo, token, isSocketReady }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
