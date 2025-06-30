"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import ChatRoom from "@/components/ChatRoom";
import { useSocket } from "@/context/SocketContext";
import ChangeUsername from "@/components/ChangeUsername";
import { usePreLoader } from "@/context/PreLoaderContext";
import axios from "../../../axios";
import { toast } from "react-toastify";
import Image from "next/image";

export default function Room() {
  const { roomCode } = useParams();
  const { socket, userInfo, isSocketReady } = useSocket();
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const [hasError, setHasError] = useState(false);
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
      hasAttemptedJoin.current = true;
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
      } else {
        setHasError(true);
      }
    } catch (err) {
      console.log(err);
      toast.error("Could not join a room");
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showUsernamePrompt ? (
        <ChangeUsername updateUsername={updateUsername} userInfo={userInfo} />
      ) : hasJoinedRoom ? (
        <ChatRoom
          roomCode={roomCode}
          userInfo={userInfo}
          socket={socket}
          setIsLoading={setIsLoading}
        />
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="w-2/3 flex justify-center">
            <div>
              <Image
                src={`${hasError ? "/error.svg" : "/waiting.svg"}`}
                alt="waiting"
                height={500}
                width={500}
              />
              <p className={`text-3xl font-extrabold`}>
                {hasError
                  ? "We could not process your request"
                  : "Please wait while we process your request"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
