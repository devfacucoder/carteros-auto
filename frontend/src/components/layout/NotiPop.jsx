import { useState, useEffect } from "react";

import useNotis from "../../hooks/useNotis";

function NotiPop({ message, type, id }) {
  const [showNotiPop, setShowNotiPop] = useState(false);
  const { closeNoti } = useNotis();
  useEffect(() => {
    const timer = setTimeout(() => {
      closeNoti(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id]);
  return (
    <div
      className={`flex popAnimate gap-2 top-10 right-10 justify-between border-b-2 ${type === "success" ? "border-green-500" : "border-red-500"} bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg`}
    >
      <p className="text-sm">{message}</p>
      <button
        onClick={() => {
          closeNoti(id);
        }}
        className="text-white text-sm font-bold"
      >
        X
      </button>
    </div>
  );
}

export default NotiPop;
