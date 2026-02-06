import { FaFilePdf, FaSave, FaUpload, FaEdit } from "react-icons/fa";
import { useRef, useState } from "react";
import ListPdfs from "../components/layout/ListPdfs";
function Configuración() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("Ningún archivo seleccionado");
  const [customName, setCustomName] = useState(""); // 👈 Nombre personalizado
  const [loading, setLoading] = useState(false);

  const uploadPDF = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) return alert("Seleccioná un PDF");

    if (file.type !== "application/pdf") {
      return alert("Solo se permiten archivos PDF");
    }

    // 👇 Usar nombre personalizado o nombre original
    const finalName = customName.trim() || file.name.replace(".pdf", "");

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("nombre", finalName); // 👈 Enviar nombre personalizado

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5178/upload-cv", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error subiendo archivo");

      const data = await res.json();
      alert(`CV subido correctamente como: ${data.filename}`);

      // Limpiar campos
      setFileName("Ningún archivo seleccionado");
      setCustomName("");
      fileInputRef.current.value = "";
    } catch (error) {
      alert("Error al subir el PDF");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const HandleGetPDFS = async () => {
    try {
      const res = await fetch("http://localhost:5178/list-pdfs");
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error al obtener PDFs:", error);
    }
  };
  return (
    <div className="w-full min-h-screen bg-gray-950 text-cyan-300 p-6">
      {/* Header */}
      <div className="w-full h-24 bg-blue-950 rounded-xl flex items-center px-6 mb-6">
        <h1 className="text-2xl font-semibold text-yellow-400">
          Configuración
        </h1>
      </div>
     
      {/* Card */}
      <div className="flex flex-row-reverse gap-4 justify-end">
        <ListPdfs />
        <div className="max-w-xs bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-yellow-400 mb-1">
            PDF adjunto por defecto
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Este archivo se enviará automáticamente junto con los emails
          </p>

          {/* Selector */}
          <div className="flex items-center gap-3 bg-gray-950 border border-gray-800 rounded-lg p-3 mb-4">
            <FaFilePdf className="text-red-500" size={22} />

            <span className="text-sm text-gray-400 flex-1 truncate">
              {fileName}
            </span>

            <button
              onClick={() => fileInputRef.current.click()}
              className="btn_outline flex items-center gap-2 px-3 py-1 text-sm"
            >
              <FaUpload size={14} />
              Elegir
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) =>
                setFileName(
                  e.target.files[0]?.name || "Ningún archivo seleccionado",
                )
              }
            />
          </div>

          {/* 👇 NUEVO: Campo para nombre personalizado */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <FaEdit size={14} />
              Nombre personalizado (opcional)
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Ej: CV-Juan-Perez"
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-cyan-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si no ingresás nada, se usará el nombre original del archivo
            </p>
          </div>

          {/* Guardar */}
          <div className="flex justify-end">
            <button
              disabled={loading}
              onClick={uploadPDF}
              className="btn_primary flex items-center gap-2 px-5 py-2"
            >
              <FaSave size={14} />
              {loading ? "Subiendo..." : "Guardar configuración"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuración;
