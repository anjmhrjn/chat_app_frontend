"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MdAddCircle } from "react-icons/md";
import { IoEnter } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";

import ChangeUsername from "@/components/ChangeUsername";
import { useSocket } from "@/context/SocketContext";
import { usePreLoader } from "@/context/PreLoaderContext";
import axios from "../axios";
import JoinRoomPrompt from "@/components/JoinRoomPrompt";

export default function Home() {
  const router = useRouter();
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [showJoinRoomPrompt, setShowJoinRoomPrompt] = useState(false);
  const { socket, isSocketReady, userInfo } = useSocket();
  const { setIsLoading } = usePreLoader();

  useEffect(() => {
    if (!isSocketReady) return;
    socket.on("needUsername", handleNeedUsername);
    socket.on("tokenIssued", handleTokenIssued);
    socket.emit("clientReady")

    return () => {
      socket.off("needUsername", handleNeedUsername);
      socket.off("tokenIssued", handleTokenIssued);
    };
  }, [isSocketReady, socket]);

  const handleNeedUsername = () => {
    setShowUsernamePrompt(true);
  };

  const updateUsername = (value) => {
    socket.emit("setUsername", { username: value });
  };

  const handleTokenIssued = () => {
    setShowUsernamePrompt(false);
  };

  const handleUserJoined = (roomCode) => {
    router.push(`/room/${roomCode}`);
  };

  const createRoom = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post(`/room/`);
      if (result?.data?.success) {
        const roomCode = result?.data?.roomCode;
        handleUserJoined(roomCode);
      }
    } catch (err) {
      console.log(err);
      // add toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = () => {
    setShowJoinRoomPrompt(true);
  };

  const joinRoom = async (roomCode) => {
    handleUserJoined(roomCode);
  };

  return showUsernamePrompt ? (
    <ChangeUsername updateUsername={updateUsername} userInfo={userInfo} />
  ) : showJoinRoomPrompt ? (
    <JoinRoomPrompt joinRoom={joinRoom} setShowJoinRoomPrompt={setShowJoinRoomPrompt} />
  ) : (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full md:w-1/3 h-screen md:h-1/4">
        <div className="p-4 backdrop-blur-xl rounded-2xl">
          <p className="text-center font-extrabold text-4xl">Welcome!</p>
          {userInfo?.username && (
            <p
              className="flex items-center justify-center font-semibold text-2xl mb-3 cursor-pointer text-gray-600"
              onClick={() => setShowUsernamePrompt(true)}
            >
              <span className="mr-3">{userInfo?.username}</span>
              <FaEdit />
            </p>
          )}

          <div className="px-3 mb-3 text-xl">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full p-2 w-full"
              onClick={createRoom}
            >
              <span className="flex items-center justify-center">
                Create Room
                <MdAddCircle className="ml-2" />
              </span>
            </button>
          </div>
          <div className="px-3 pb-3 text-xl">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-full p-2 w-full"
              onClick={handleJoinRoom}
            >
              <span className="flex items-center justify-center">
                Join Room
                <IoEnter className="ml-2" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
