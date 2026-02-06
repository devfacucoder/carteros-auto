import { useState, createContext, useEffect, useContext } from "react";
import "./App.css";
import ModalEdit from "./components/forms/ModalEdit";
import CardEmail from "./components/layout/CardEmail";
import ModalCreateEmail from "./components/forms/ModalCreateEmail";
import useCRUDEmail from "./hooks/useCRUDEmail";
export const emailContext = createContext();
export const notiContext = createContext();

import Header from "./components/layout/Header";
import Aside from "./components/layout/Aside";
import { Link, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
const PORT = import.meta.env.VITE_BACKEND_PORT;
import NotiPop from "./components/layout/NotiPop";
export const socket = io(`http://127.0.0.1:${PORT}`);

import DashBoard from "./pages/DashBoard";
import Configuración from "./pages/Configuracion";
import Users from "./pages/Users";
import Snake from "./pages/Snake";
import Ayuda from "./pages/Ayuda";
import About from "./pages/About";
function App() {
  const [emails, setEmails] = useState([]);
  const [notisList, setNotiList] = useState([]);
  return (
    <notiContext.Provider value={{ notisList, setNotiList }}>
      <emailContext.Provider value={{ emails, setEmails }}>
        <div className="flex flex-col bg-gray-950 max-w-screen min-h-screen">
          <div className="flex w-full min-h-screen">
            <Aside />

            <div className="fixed   flex flex-col gap-2 top-10 right-10 w-[300px] z-[1000]">
              {notisList.map((item, index) => (
                <NotiPop
                  id={item.id}
                  key={item.id}
                  message={item.message}
                  type={item.type}
                />
              ))}
            </div>
            <main className="w-[85%] min-h-screen">
              <Routes>
                <Route path="/" element={<DashBoard />} />
                <Route path="/config" element={<Configuración />} />
                <Route path="/users" element={<Users />} />
                <Route path="/snake" element={<Snake />} />
                <Route path="/ayuda" element={<Ayuda />} />
                <Route path="/acerca" element={<About />} />
              </Routes>
            </main>
          </div>
        </div>
      </emailContext.Provider>
    </notiContext.Provider>
  );
}
/**
 * 
 * @param {   <AppInner
        viewModalCreateEmail={viewModalCreateEmail}
        setViewModalCreateEmail={setViewModalCreateEmail}
      />} param0 
 * @returns 
 */
function AppInner({ viewModalCreateEmail, setViewModalCreateEmail }) {
  const { emails, setEmails } = useContext(emailContext);
  const { loadEmails } = useCRUDEmail();

  useEffect(() => {
    loadEmails();
  }, []);
  const handleSubmit = async () => {
    if (emails.length === 0) {
      alert("Agregá al menos un email");
      return;
    }

    // 👉 solo los emails listos
    const emailsReady = emails.filter((item) => item.ready === true);

    if (emailsReady.length === 0) {
      alert("No hay emails listos para enviar");
      return;
    }

    const now = new Date().toISOString();

    const updatedEmails = emails.map((item) =>
      item.ready
        ? {
            ...item,
            timeSent: (item.timeSent || 0) + 1,
            lastTimeSent: now,
          }
        : item,
    );
    setEmails(updatedEmails);
    localStorage.setItem("emails", JSON.stringify(updatedEmails));

    const objRes = emailsReady.map((email) => ({
      email: email.email,
      subject: email.subject,
      message: email.message,
    }));

    const response = await fetch("http://localhost:3000/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ojects: objRes,
      }),
    });

    if (response.ok) {
      alert(`Se enviaron ${emailsReady.length} correos`);
    } else {
      alert("Error al enviar los correos");
    }
  };

  return (
    <>
      {viewModalCreateEmail && (
        <ModalCreateEmail onClose={setViewModalCreateEmail} />
      )}
      <div className="flex flex-col bg-gray-900 text-yellow-400 px-4  ">
        <header className="w-full h-[60px] bg-blue-950">Auto Emails</header>

        <div className="flex bg-blue-950">
          <aside className="w-[25%]">
            <button
              className="bg-gray-900 text-yellow-400 px-4 py-2 rounded-md"
              onClick={() => setViewModalCreateEmail(true)}
            >
              Agregar Correo
            </button>
            <button
              className="bg-gray-900 text-yellow-400 px-4 py-2 rounded-md"
              onClick={handleSubmit}
            >
              Enviar Todos
            </button>
          </aside>
          <main className="flex">
            <div className="max-w-screen pt-4 flex-col min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="flex flex-wrap gap-2 pt-4 pb-4 justify-center">
                {emails.map((e) => (
                  <CardEmail key={e.id} emailData={e} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
