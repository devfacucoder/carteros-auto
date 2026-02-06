import { FaFilePdf, FaTrash, FaSync } from "react-icons/fa";
import { useEffect, useState } from "react";

function ListPdfs() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPdfs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5178/list-pdfs");
      const data = await res.json();
      
      if (data.ok) {
        setPdfs(data.pdfs);
      }
    } catch (error) {
      console.error("Error al cargar PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePdf = async (filename) => {
    if (!confirm(`¿Eliminar ${filename}?`)) return;

    try {
      const res = await fetch(`http://localhost:5178/delete-pdf/${filename}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("PDF eliminado correctamente");
        fetchPdfs(); // Recargar lista
      }
    } catch (error) {
      alert("Error al eliminar PDF");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  return (
    <div className="max-w-xl bg-gray-900 rounded-xl border border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-yellow-400">
            PDFs guardados
          </h3>
          <p className="text-sm text-gray-400">
            {pdfs.length} {pdfs.length === 1 ? "archivo" : "archivos"} disponibles
          </p>
        </div>

        <button
          onClick={fetchPdfs}
          disabled={loading}
          className="btn_outline flex items-center gap-2 px-3 py-1 text-sm"
        >
          <FaSync className={loading ? "animate-spin" : ""} size={14} />
          Actualizar
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Cargando...
          </div>
        ) : pdfs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay PDFs guardados
          </div>
        ) : (
          pdfs.map((pdf) => (
            <div
              key={pdf.name}
              className="flex items-center gap-3 bg-gray-950 border border-gray-800 rounded-lg p-3 hover:border-cyan-500 transition-colors"
            >
              <FaFilePdf className="text-red-500" size={20} />

              <span className="text-sm text-cyan-300 flex-1 truncate">
                {pdf.name}
              </span>

              <button
                onClick={() => deletePdf(pdf.name)}
                className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded transition-colors"
                title="Eliminar PDF"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ListPdfs;