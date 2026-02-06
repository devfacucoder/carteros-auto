import { CiEdit } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import CircularProgress from "../ui/CircularProgress";
import { FaCheck } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";

import { emailContext } from "../../App";
import { socket } from "../../App";
import { data } from "react-router-dom";
import { FaHourglassEnd } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import useNoti from "../../hooks/useNotis";
function ModalEnviar({ onClose }) {
  const { emails } = useContext(emailContext);
  const [emailsForSend, setEmailsForSend] = useState([]);
  const [progress, setProgress] = useState({ total: 0, pro: 0 });
  const { createNoti } = useNoti();
  const handleSendEmails = () => {
    // Marcar como "enviando"
    setEmailsForSend((prev) => prev.map((e) => ({ ...e, status: "enviando" })));
    setProgress({ total: emailsForSend.length, pro: 0 });
    socket.emit("send-multiple-emails", emailsForSend);
  };
  useEffect(() => {
    const selectEmails = () => {
      const userSeleccionado =
        localStorage.getItem("userSeleccionado") || "defaultUser";
      const filtrarEmails = emails.filter(
        (e) => e.user === userSeleccionado && e.ready,
      );
      setEmailsForSend(filtrarEmails);
      setProgress({ total: filtrarEmails.length, pro: 0 });
    };
    selectEmails();
  }, [emails]);

  useEffect(() => {
    socket.on("email-progress", (data) => {
      setEmailsForSend((prev) =>
        prev.map((email) =>
          email.email === data.sent ? { ...email, status: "enviado" } : email,
        ),
      );
      setProgress({ total: data.total, pro: data.current });
    });

    return () => {
      socket.off("email-progress");
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[900px] h-[520px] bg-gray-900 rounded-xl shadow-2xl border border-gray-800 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-cyan-400">
            📧 Envío de correos
          </h2>

          <button
            onClick={() => {
              onClose(false);
            }}
            className="text-gray-400 hover:text-red-400 transition"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">
          {/* LISTA */}
          <div className="w-1/2 border-r border-gray-800 overflow-y-auto px-6 py-4">
            <h3 className="text-sm text-gray-400 mb-3"></h3>

            <ul className="space-y-3">
              {emailsForSend.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between bg-gray-800/60 rounded-lg px-4 py-3"
                >
                  <p className="text-sm text-white truncate max-w-[80%]">
                    {e.email}
                  </p>
                  {e.status === "enviado" ? (
                    <FaCheck className="text-green-400" />
                  ) : e.status === "enviando" ? (
                    <FaHourglassEnd className="text-yellow-400" />
                  ) : (
                    <MdOutlineWatchLater className="text-red-400" />
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-1/2 flex flex-col items-center justify-center gap-4">
            <CircularProgress
              percentage={Math.floor(
                progress.total ? (progress.pro / progress.total) * 100 : 0,
              )}
            />
            <p className="text-sm text-gray-400">
              {progress.pro}/{progress.total} enviados
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t items-center gap-4 border-gray-800 px-6 py-4 flex justify-end">
          <button
            onClick={handleSendEmails}
            className="bg-cyan-600 hover:bg-cyan-700 transition text-white px-6 py-2 rounded-lg font-medium"
          >
            Enviar correos
          </button>
        </div>
      </div>
    </div>
  );
}
export default ModalEnviar;
