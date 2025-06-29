"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ImExit } from "react-icons/im";
import { BsFillSendFill } from "react-icons/bs";
import TextareaAutosize from "react-textarea-autosize";

import axios from "../axios";
import { toast } from "react-toastify";

export default function ChatRoom({ roomCode, userInfo, socket, setIsLoading }) {
  const [allMessages, setAllMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    const userLeftHandler = ({ username }) => {
      setAllMessages((prev) => [
        ...prev,
        { type: "info", message: `${username} has left the room` },
      ]);
    };

    const userJoinedHandler = ({ username }) => {
      setAllMessages((prev) => [
        ...prev,
        { type: "info", message: `${username} has joined the room` },
      ]);
    };

    const handleNewMessage = (data) => {
      setAllMessages((prev) => [
        ...prev,
        {
          senderUsername: data?.senderUsername,
          message: data?.message,
          senderGuestId: data?.senderGuestId,
        },
      ]);
    };

    socket.on("userLeft", userLeftHandler);
    socket.on("userJoined", userJoinedHandler);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("userLeft", userLeftHandler);
      socket.off("userJoined", userJoinedHandler);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    getAllMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const leaveRoom = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post(`/room/leave-room`, { roomCode });
      if (result?.data?.success) {
        toast.success("Room left successfully!");
        socket.emit("leaveRoom", { roomCode: roomCode });
        router.push("/");
      }
    } catch (err) {
      console.log(err);
      toast.error("Could not leave a room");
    } finally {
      setIsLoading(false);
    }
  };

  const getAllMessages = async () => {
    try {
      const result = await axios.get(`/message/get-all-messages/${roomCode}`);
      if (result?.data?.success) {
        setAllMessages(result?.data?.messages);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error getting all the messages");
    }
  };

  const sendMessage = () => {
    socket.emit("sendMessage", { roomCode, message: currentMessage });
    setCurrentMessage("");
  };

  return (
    <div className="h-screen antialiased text-gray-800 pt-16">
      <div className="h-9/10 mx-auto w-full md:w-1/2 overflow-x-hidden">
        <div className="flex flex-col flex-auto h-full">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl backdrop-blur-xl h-full shadow-xl">
            <div className="w-full">
              <div className="flex justify-between items-center py-4 px-7">
                <p className="font-extrabold text-2xl capitalize">{roomCode}</p>
                <div className="relative group inline-block">
                  <ImExit
                    className="text-red-500 cursor-pointer text-2xl"
                    onClick={leaveRoom}
                  />
                  <div className="absolute left-1/4 -translate-x-1/2 mt-2 w-max rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    Leave Room
                  </div>
                </div>
              </div>
              <hr className="border-t-2 border-white w-full" />
            </div>
            <div className="flex flex-col h-full overflow-x-auto mb-4 p-4">
              <div className="flex flex-col h-full">
                {allMessages.map((msg, index) => {
                  const isCurrentUser = msg.senderGuestId === userInfo.guestId;

                  return msg?.type === "info" ? (
                    <div key={index} className="flex w-full justify-center">
                      <p className="font-light text-gray-500 text-xs mb-2">
                        {msg.message}
                      </p>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className={`flex w-full ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      } mb-2`}
                    >
                      <div
                        className={`inline-block px-4 py-2 rounded-xl text-sm shadow max-w-[75%] ${
                          isCurrentUser
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        <p className="font-semibold text-xs mb-1">
                          {msg.senderUsername}
                        </p>
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="w-full bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0 z-10">
              <div className="flex items-end gap-4">
                <TextareaAutosize
                  minRows={1}
                  maxRows={6}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Message..."
                  className="flex-grow resize-none rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white shadow-sm transition-all duration-200"
                />
                <button
                  onClick={sendMessage}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow text-sm flex items-center gap-2"
                >
                  <span>Send</span>
                  <BsFillSendFill size={16} />
                </button>
              </div>
            </div>

            {/* <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
              <div className="flex-grow">
                <div className="relative w-full">
                  <textarea
                    rows={1}
                    className="w-full resize-none overflow-y-auto border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 py-2 h-10 max-h-40"
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    value={currentMessage}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // Prevent newline
                        sendMessage();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="ml-4">
                <button
                  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                  onClick={sendMessage}
                >
                  <span>Send</span>
                  <BsFillSendFill className="ml-2" />
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
