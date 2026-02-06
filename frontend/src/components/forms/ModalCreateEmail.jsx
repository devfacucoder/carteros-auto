import { MdClose } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { useState,useEffect } from "react";
import useCRUDEmail from "../../hooks/useCRUDEmail";
import useNoti from "../../hooks/useNotis";
function ModalCreateEmail({ onClose }) {
  const { createEmail } = useCRUDEmail();
  const [msgStatus, setMsgStatus] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [pdfList, setPdfList] = useState([]);
  const [pdf, setPdf] = useState(null); 
  const { createNoti } = useNoti();
  const handleCreate = () => {
    if (!email || !subject || !message) return;

    createEmail({
      email,
      subject,
      message,
      pdf,
    });
    setMsgStatus("Email creado con éxito");

    setEmail("");
    setSubject("");
    setMessage("");
    createNoti("Email creado con éxito", "success");
  };
  useEffect(() => {
    const HandleGetPDFS = async () => {
      try {
        const res = await fetch("http://localhost:5178/list-pdfs");
        const data = await res.json();
        setPdfList(data.pdfs || []);
        console.log(data);
      } catch (error) {
        console.error("Error al obtener PDFs:", error);
      }
    };
    HandleGetPDFS();
  }, []);
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[460px] bg-gray-900 rounded-xl shadow-2xl border border-gray-800 flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-cyan-400">Nuevo correo</h2>

          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-red-400 transition"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-4 space-y-4">
          {/* Email */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Email receptor
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="empresa@correo.com"
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Asunto */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Asunto</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Postulación laboral"
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* PDF Select */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Seleccionar PDF (Opcional)
            </label>
            <select
              value={null}
              onChange={(e) => setPdf(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 outline-none focus:ring-2 focus:ring-cyan-500 hover:border-cyan-500 transition cursor-pointer"
            >
              <option value="">-- PDF por defecto --</option>
              {pdfList.map((item, index) => (
                <option key={index} value={item}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mensaje */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Mensaje</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hola, adjunto mi CV..."
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {msgStatus && <p className="text-green-500 text-sm">{msgStatus}</p>}
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-800 px-6 py-4 flex gap-3">
          <button
            onClick={handleCreate}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 transition text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <IoIosSend />
            Crear
          </button>

          <button
            onClick={() => onClose(false)}
            className="flex-1 bg-gray-800 hover:bg-red-800 transition text-gray-300 py-2 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalCreateEmail;
