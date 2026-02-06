import ModalEdit from "../components/forms/ModalEdit";
import CardEmail from "../components/layout/CardEmail";
import ModalCreateEmail from "../components/forms/ModalCreateEmail";
import ModalEnviar from "../components/forms/ModalEnviar";
import { emailContext } from "../App";
import useCRUDEmail from "../hooks/useCRUDEmail";
import { useState, useEffect, useContext } from "react";
import { socket } from "../App";
import Alert from "../components/layout/Alert";
import { FaDatabase } from "react-icons/fa6";
import ModalDatos from "../components/forms/ModalDatos";

function DashBoard() {
  const [viewModalEnviar, setViewModalEnviar] = useState(false);
  const { emails, setEmails } = useContext(emailContext);
  const { loadEmails, darAuthor } = useCRUDEmail();
  const [viewAlert, setViewAlert] = useState(false);
  const [viewModalDatos, setViewModalDatos] = useState(false);
   const [viewModalCreateEmail, setViewModalCreateEmail] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userSeleccionado, setUserSeleccionado] = useState("");

  // 👇 Cargar emails al montar (UNA SOLA VEZ)
  useEffect(() => {
    loadEmails();
  }, []);

  // 👇 Escuchar cambio de usuario y actualizar info
  useEffect(() => {
    const updateUserInfo = () => {
      const selectedId = localStorage.getItem("userSeleccionado");
      setUserSeleccionado(selectedId);
      
      const storedUsers = localStorage.getItem("usuarios");
      if (storedUsers && selectedId) {
        try {
          console.log(selectedId)
          const users = JSON.parse(storedUsers);
          const foundUser = users.find(u => u.id === selectedId);
          console.log(foundUser)
          setUserInfo(foundUser || null);
        } catch (e) {
          console.error("Error parsing users", e);
          setUserInfo(null);
        }
      } else {
        setUserInfo(null);
      }
    };

    updateUserInfo();

    const handleUserChange = () => {
      updateUserInfo();
    };

    window.addEventListener("userChanged", handleUserChange);
    return () => window.removeEventListener("userChanged", handleUserChange);
  }, []);

  // 👇 Filtrar emails por usuario
  const emailsFiltrados = emails.filter((e) => e.user === userSeleccionado);

  const sendEmail = () => {
    socket.emit("send-email", {
      from: "facuferreyra101@gmail.com",
      to: "facucoder@gmail.com",
      subject: "Prueba WebSocket",
      text: "Email enviado con WebSocket + Nodemailer",
    });
  };

  return (
    <div className="text-cyan-500 h-screen overflow-y-auto">
      <div className="p-4 flex gap-2 justify-between">
        {viewModalDatos ? <ModalDatos onclose={setViewModalDatos} /> : null}
        {viewModalEnviar ? <ModalEnviar onClose={setViewModalEnviar} /> : null}
        {viewModalCreateEmail ? (
          <ModalCreateEmail onClose={setViewModalCreateEmail} />
        ) : null}
        {viewAlert ? <Alert onClose={setViewAlert} /> : null}

        {/* Acciones principales */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setViewModalCreateEmail(true)}
            className="btn_primary flex items-center gap-2 px-4 py-2"
          >
            ➕ Crear correo
          </button>

          <button
            onClick={() => setViewModalEnviar(true)}
            className="btn_secondary flex items-center gap-2 px-4 py-2"
          >
            📤 Enviar todos
            <span className="badge">{emailsFiltrados.length}</span>
          </button>
        </div>

        {/* Datos */}
        <button
          onClick={() => {
            setViewModalDatos(true);
          }}
          className="btn_outline flex items-center gap-2 px-4 py-2"
        >
          <FaDatabase size={18} />
          Datos
        </button>
      </div>
      <p className="px-4 text-cyan-300 font-semibold">
        {emailsFiltrados.length === 0
          ? null
          : `Hay ${emailsFiltrados.length} emails para ${userInfo?.nombre || "Usuario Desconocido"}`}
      </p>
      <div className="p-4 flex gap-2 flex-wrap items-start justify-center min-h-full">
        {emailsFiltrados.length === 0 ? (
          <div className="w-full text-center py-12 text-gray-500">
            <p className="text-lg">No hay emails para {userInfo?.nombre || "el usuario seleccionado"}</p>
            <p className="text-sm mt-2">Creá un nuevo correo para comenzar</p>
          </div>
        ) : (
          emailsFiltrados.map((e) => <CardEmail key={e.id} emailData={e} />)
        )}
      </div>
    </div>
  );
}

export default DashBoard;
