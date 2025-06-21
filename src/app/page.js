'use client'
import { useRouter } from "next/navigation";

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className=" w-75">
        <p className="text-center">Hi User!</p>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 text-white rounded-full p-2"
            onClick={createRoom}
          >
            Create Room
          </button>
          <button
            className="bg-blue-500 text-white rounded-full p-2"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
