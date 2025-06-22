export default function OtherMessage({ username, message }) {
  return (
    <div className="col-start-1 col-end-8 px-3 py-1 rounded-lg">
      <div className="">
        <p className="font-bold">{username}</p>
        <div className="text-sm bg-white py-2 px-4 shadow rounded-xl">
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
}
