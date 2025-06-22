"use client";
import { useRouter } from "next/navigation";

import { MdAddCircle } from "react-icons/md";
import { IoEnter } from "react-icons/io5";

export default function Home() {
  const router = useRouter();

  const createRoom = () => {
    const roomId = "abc";
    router.push(`/room/${roomId}`);
  };

  const joinRoom = () => {
    const roomId = "def";
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full md:w-1/4 h-screen md:h-1/4">
        <div className="p-4 backdrop-blur-xl rounded-2xl">
          <p className="text-center font-extrabold text-4xl mb-3">Welcome!</p>
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
              onClick={joinRoom}
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
