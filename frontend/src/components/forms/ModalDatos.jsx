import { FaSave, FaCopy, FaDownload } from "react-icons/fa";
import { useContext } from "react";
import { emailContext } from "../../App";
import { useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import useCRUDEmail from "../../hooks/useCRUDEmail";

function ModalDatos({ onclose }) {
  const { createManyEmails } = useCRUDEmail();
  const { emails } = useContext(emailContext);
  const [listEmails, setListEmails] = useState([]);
  const [strViewEmails, setStrViewEmails] = useState("");
  const textAreaRef = useRef(null);

  const exportEmails = () => {
    // Si hay datos estructurados, exportar como JSON
    if (listEmails.length > 0 && typeof listEmails[0] === "object") {
      const result = JSON.stringify(listEmails, null, 2);
      setStrViewEmails(result);
    } else {
      // Fallback a lista simple si fuera necesario (aunque ahora siempre serán objetos)
      const result = listEmails.map((e) => e.email).join("\n");
      setStrViewEmails(result);
    }
  };

  const loadEmails = () => {
    const text = textAreaRef.current.value.trim();
    if (!text) return;

    try {
      // Intentar parsear como JSON (Formato Objeto)
      const parsedData = JSON.parse(text);

      if (Array.isArray(parsedData)) {
        console.log("Importando JSON:", parsedData);
        createManyEmails(parsedData);
        alert("Emails importados correctamente desde JSON");
        return;
      }
    } catch (e) {
      // Si falla, asumir formato lista simple (email por línea)
      console.log("Formato JSON no válido, intentando como lista simple");
    }

    // Formato Lista Simple
    const arr = text
      .split("\n") // separa por salto de línea
      .map((e) => e.trim()) // limpia espacios
      .filter((e) => e !== ""); // elimina vacíos

    if (arr.length > 0) {
      console.log("Importando lista simple:", arr);
      createManyEmails(arr);
      alert("Emails importados correctamente como lista");
    }
  };

  const copied = () => {
    navigator.clipboard
      .writeText(strViewEmails)
      .then(() => {
        console.log("Texto copiado con éxito");
        alert("Copiado al portapapeles");
      })
      .catch((err) => {
        console.error("Error al copiar el texto: ", err);
      });
  };

  useEffect(() => {
    const userSeleccionado = localStorage.getItem("userSeleccionado");
    const emailsFiltrados = emails.filter((e) => e.user === userSeleccionado);

    // Crear array de objetos con la estructura solicitada
    const emailsArray = emailsFiltrados.map((item) => ({
      email: item.email,
      subject: item.subject || "",
      message: item.message || "",
      // Extraer nombre del PDF si es objeto, o dejarlo como string si ya lo es
      pdf:
        item.pdf && typeof item.pdf === "object"
          ? item.pdf.name
          : item.pdf || "",
    }));

    setListEmails(emailsArray);
  }, [emails]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[600px] bg-gray-900 rounded-xl shadow-2xl border border-gray-800 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b flex justify-between border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-yellow-400">
              Gestión de Datos
            </h2>
            <p className="text-sm text-gray-400">
              Importar/Exportar emails y datos (JSON o Lista)
            </p>
          </div>
          <button
            onClick={() => {
              onclose(false);
            }}
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <textarea
            ref={textAreaRef}
            defaultValue={strViewEmails}
            placeholder={`Pegá aquí tus datos.
Ejemplo JSON:
[
  {
    "email": "ejemplo@correo.com",
    "subject": "Asunto",
    "message": "Hola...",
    "pdf": "archivo.pdf"
  }
]
O lista simple:
correo1@gmail.com
correo2@hotmail.com`}
            className="w-full h-[350px] resize-none rounded-lg bg-gray-950 border border-gray-800 text-cyan-300 p-3 text-xs font-mono outline-none focus:border-yellow-500"
          />
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-800 flex justify-between items-center">
          <button
            onClick={() => {
              exportEmails();
            }}
            className="btn_outline flex items-center gap-2 px-4 py-2"
          >
            <FaDownload size={14} />
            Extraer (JSON)
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                copied();
              }}
              className="btn_secondary flex items-center gap-2 px-4 py-2"
            >
              <FaCopy size={14} />
              Copiar
            </button>

            <button
              onClick={() => {
                loadEmails();
              }}
              className="btn_primary flex items-center gap-2 px-4 py-2"
            >
              <FaSave size={14} />
              Guardar / Importar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDatos;
