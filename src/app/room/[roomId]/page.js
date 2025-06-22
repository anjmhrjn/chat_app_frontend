"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";

import { getSocket } from "@/lib/socket";
import ChatRoom from "@/components/ChatRoom";

export default function Room() {
  const { roomId } = useParams();
  useEffect(() => {
    const socket = getSocket();
    const username = "user1"; // get from local storage
    socket.emit("joinRoom", { roomId, username });

    return () => {
      // Remove the listener when component unmounts
      socket.off("newMessage");
    };
  }, []);

  return <ChatRoom />;
}
