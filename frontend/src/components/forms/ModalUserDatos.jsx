import { MdClose } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { useState, useEffect } from "react";

function ModalUserDatos({ onClose, onFun, initialData }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [cod, setCod] = useState("");

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || "");
      setEmail(initialData.email || "");
      setCod(initialData.cod || "");
    }
  }, [initialData]);

  const handleSave = () => {
    if (onFun) {
      onFun({ nombre, email, cod });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[460px] bg-gray-900 rounded-xl shadow-2xl border border-gray-800 flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-cyan-400">
            {initialData ? "Editar Usuario" : "Nuevo Usuario"}
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
          {/* Nombre */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del usuario"
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Email (Gmail)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@gmail.com"
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Cod (App Password) */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Código de Aplicación (Gmail)
            </label>
            <input
              type="text"
              value={cod}
              onChange={(e) => setCod(e.target.value)}
              placeholder="xxxx xxxx xxxx xxxx"
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-800 px-6 py-4 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 transition text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <FaSave />
            Guardar
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

export default ModalUserDatos;
