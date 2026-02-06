import { CiEdit } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import useCRUDEmail from "../../hooks/useCRUDEmail";
import { useState, useEffect } from "react";
import useNotis from "../../hooks/useNotis"
function ModalEdit({ onClose, emailData }) {
  const { editEmail } = useCRUDEmail();
  const {createNoti} = useNotis()
  const [contentEdit, setContentEdit] = useState({
    email: emailData.email,
    subject: emailData.subject,
    message: emailData.message,
    pdf:emailData.pdf
  });
  const handlePdf = (e) => {
    setContentEdit({ ...contentEdit, pdf: e.target.value });
  };
  const handleEdit = () => {
    editEmail(
      emailData.id,
      contentEdit.email,
      contentEdit.subject,
      contentEdit.message,
      contentEdit.pdf
    );
    createNoti("email editado","success")

    onClose(false);
  };
  const [pdfList, setPdfList] = useState([]);
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
      <div className="w-[420px] bg-gray-900 rounded-xl shadow-2xl border border-gray-800 flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <CiEdit />
            Editar correo
          </h2>

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
            <label className="text-xs text-gray-400 block mb-1">Email</label>
            <input
              type="email"
              value={contentEdit.email}
              onChange={(e) =>
                setContentEdit({ ...contentEdit, email: e.target.value })
              }
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Asunto */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Asunto</label>
            <input
              type="text"
              value={contentEdit.subject}
              onChange={(e) =>
                setContentEdit({ ...contentEdit, subject: e.target.value })
              }
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Seleccionar PDF (Opcional)
            </label>
            <select
              value={contentEdit.pdf}
              onChange={handlePdf}
              className="
    w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm
    border border-gray-700 outline-none
    focus:ring-2 focus:ring-cyan-500
    hover:border-cyan-500 transition cursor-pointer
  "
            >
              <option value="">-- PDF por defecto --</option>

              {Array.isArray(pdfList) &&
                pdfList.map((pdf, index) => (
                  <option
                    key={index}
                    className="bg-gray-800 text-white"
                    value={pdf.name}
                  >
                    {pdf.name}
                  </option>
                ))}
            </select>
          </div>
          {/* Mensaje */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Mensaje</label>
            <textarea
              value={contentEdit.message}
              onChange={(e) =>
                setContentEdit({ ...contentEdit, message: e.target.value })
              }
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm h-[100px] resize-none outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-800 px-6 py-4 flex gap-3">
          <button
            onClick={handleEdit}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 transition text-white py-2 rounded-lg font-medium"
          >
            Guardar cambios
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

export default ModalEdit;
