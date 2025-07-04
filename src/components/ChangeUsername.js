import { useState } from "react";
import { BsFillSendFill } from "react-icons/bs";

export default function ChangeUsername({ updateUsername, userInfo }) {
  const [currentUsername, setCurrentUsername] = useState(
    userInfo?.username ?? ""
  );
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full md:w-1/4 h-screen md:h-1/4">
        <div className="p-4 backdrop-blur-xl rounded-2xl">
          <p className="px-3 font-extrabold text-3xl mb-3">Username:</p>
          <div className="px-3 mb-3 text-xl">
            <input
              value={currentUsername}
              onChange={(e) => {
                setCurrentUsername(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateUsername(currentUsername);
                }
              }}
              className="rounded-3xl w-full bg-white p-2"
              name="username"
            />
          </div>
          <div className="px-3 pb-3 text-xl">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-semibold rounded-full p-2 w-full"
              onClick={() => updateUsername(currentUsername)}
            >
              <span className="flex items-center justify-center">
                Submit
                <BsFillSendFill className="ml-2" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
