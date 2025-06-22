export default function MyMessage({ username, message }) {
  return (
    <div className="col-start-6 col-end-13 px-3 py-1 rounded-lg">
      <div className="">
        <p className="font-bold text-right">{username}</p>
        <div className="text-sm bg-white py-2 px-4 shadow rounded-xl">
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
}
