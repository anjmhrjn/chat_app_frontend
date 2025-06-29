import { useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { MdCancel } from "react-icons/md";

export default function JoinRoomPrompt({ joinRoom, setShowJoinRoomPrompt }) {
  const [roomCode, setRoomCode] = useState("");
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full md:w-1/4 h-screen md:h-1/4">
        <div className="p-4 backdrop-blur-xl rounded-2xl">
          <p className="px-3 font-extrabold text-3xl mb-3">Room Code:</p>
          <div className="px-3 mb-3 text-xl">
            <input
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  joinRoom(roomCode);
                }
              }}
              className="rounded-3xl w-full bg-white p-2"
              name="username"
            />
          </div>
          <div className="px-3 pb-3 flex text-xl">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-semibold rounded-full p-2 mr-3 w-5/12"
              onClick={() => joinRoom(roomCode)}
            >
              <span className="flex items-center justify-center">
                Submit
                <BsFillSendFill className="ml-2" />
              </span>
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-semibold rounded-full p-2 w-5/12"
              onClick={() => setShowJoinRoomPrompt(false)}
            >
              <span className="flex items-center justify-center">
                Cancel
                <MdCancel className="ml-2" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
