"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import ChatRoom from "@/components/ChatRoom";
import { useSocket } from "@/context/SocketContext";
import ChangeUsername from "@/components/ChangeUsername";
import { usePreLoader } from "@/context/PreLoaderContext";
import axios from "../../../axios";
import { toast } from "react-toastify";

export default function Room() {
  const { roomCode } = useParams();
  const { socket, userInfo, isSocketReady } = useSocket();
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const { setIsLoading } = usePreLoader();
  const hasAttemptedJoin = useRef(false);

  useEffect(() => {
    if (!isSocketReady) return;
    socket.on("needUsername", handleNeedUsername);
    socket.on("tokenIssued", handleTokenIssued);
    socket.on("userJoined", handleUserJoined);

    socket.emit("clientReady");

    return () => {
      socket.off("needUsername", handleNeedUsername);
      socket.off("tokenIssued", handleTokenIssued);
      socket.off("userJoined", handleUserJoined);
    };
  }, [isSocketReady, socket]);

  useEffect(() => {
    if (userInfo && !hasAttemptedJoin.current) {
      joinRoom();
      hasAttemptedJoin.current = true
    }
  }, [userInfo]);

  const handleNeedUsername = () => {
    setShowUsernamePrompt(true);
  };

  const handleTokenIssued = () => {
    setShowUsernamePrompt(false);
  };

  const updateUsername = (value) => {
    socket.emit("setUsername", { username: value });
  };

  const handleUserJoined = () => {
    // update some state so that chatroom component is displayed
    setHasJoinedRoom(true);
  };

  const joinRoom = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post(`/room/join-room`, { roomCode });
      if (result?.data?.success) {
        socket.emit("joinRoom", { roomCode: roomCode });
      }
    } catch (err) {
      console.log(err);
      toast.error("Could not join a room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showUsernamePrompt ? (
        <ChangeUsername updateUsername={updateUsername} userInfo={userInfo} />
      ) : (
        hasJoinedRoom && (
          <ChatRoom
            roomCode={roomCode}
            userInfo={userInfo}
            socket={socket}
            setIsLoading={setIsLoading}
          />
        )
      )}
    </div>
  );
}
