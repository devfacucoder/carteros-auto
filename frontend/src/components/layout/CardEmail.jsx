import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { FaCheck,FaFilePdf } from "react-icons/fa";

import useCRUDEmail from "../../hooks/useCRUDEmail";
import ModalCreateEmail from "../forms/ModalCreateEmail";
import ModalEdit from "../forms/ModalEdit";
import { useState } from "react";
import { socket } from "../../App";
import Alert from "./Alert";
import useNoti from "../../hooks/useNotis";
import { useEffect } from "react";
function CardEmail({ emailData }) {
  const { editEmail, deleteEmail, checkEmail } = useCRUDEmail();
  const [viewModalEdit, setViewModalEdit] = useState(false);
  const [viewAlert, setViewAlert] = useState(false);
  const { createNoti } = useNoti();
  const handlesubmitOneEmail = async () => {
    const objForSend = {
      email: emailData.email,
      subject: emailData.subject,
      message: emailData.message,
    };
    const response = await fetch("http://localhost:3000/sendone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailData.email,
        subject: emailData.subject,
        message: emailData.message,
      }),
    });
    if (response.ok) {
      alert(`Se enviaron ${emailsReady.length} correos`);
    } else {
      alert("Error al enviar los correos");
    }
  };

  const [alertDeleteComfirm, setAlertDeleteComfirm] = useState(null);
  const sendEmail = () => {
    socket.emit("sendoneemail", {
      to: emailData.email,
      subject: emailData.subject,
      text: emailData.message,
      pdf: emailData.pdf,
    });
    createNoti(`Se ha enviado un correo a ${emailData.email}`, "success");
  };

  return (
    <div className="text-cyan-400 bg-gray-900 h-[310px] w-80 rounded-lg shadow-lg p-2 flex flex-col justify-between">
      {viewModalEdit ? (
        <ModalEdit emailData={emailData} onClose={setViewModalEdit} />
      ) : null}
      {viewAlert ? (
        <Alert
          type="comfirm"
          onConfirm={setAlertDeleteComfirm}
          onFun={() => {
            return deleteEmail(emailData.id);
          }}
          onClose={setViewAlert}
        />
      ) : null}
      <div className="space-y-2 text-sm">
        <div className="flex gap-1">
          <span className="text-cyan-500">Email:</span>
          <span className="text-cyan-300 truncate">
            {emailData.email ? emailData.email : "error en el email"}
          </span>
        </div>

        <div className="flex gap-1">

          <span className="text-cyan-500">Asunto:</span>
          <span className="text-cyan-300 truncate">
            {emailData.subject ? emailData.subject : "error en el asunto"}
          </span>
        </div>

        <div>
          <span className="text-cyan-500">PDF:</span>

          <span className="text-cyan-300 truncate">
            <FaFilePdf size={16} className="inline-block mr-1 text-red-500" />
            {emailData.pdf ? emailData.pdf : "error en el pdf"}
          </span>
        </div>

        <div>
          <span className="text-cyan-500 block mb-1">Mensaje</span>
          <p className="text-cyan-300 text-xs leading-snug h-[80px] overflow-hidden">
            {emailData.message ? emailData.message : "error en el mensaje"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setViewModalEdit(true);
            }}
            title="Editar"
            className="bg-gray-900 text-yellow-400 p-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <CiEdit size={18} />
          </button>

          <button
            title="Eliminar"
            className="bg-gray-900 text-yellow-400 p-2 rounded-md hover:bg-red-900 transition-colors"
            onClick={() => {
              setViewAlert(true);
            }}
          >
            <MdDelete size={18} />
          </button>
        </div>

        <div>
          {emailData.lastTimeSent ? (
            <p className="text-xs text-cyan-500">
              Último envío:{" "}
              {new Date(emailData.lastTimeSent).toLocaleDateString("es-AR")}
            </p>
          ) : (
            <p className="text-xs text-cyan-700">Nunca enviado</p>
          )}

          <p className="text-sm">
            Envíos: <b>{emailData.timeSent}</b>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              sendEmail();
            }}
            title="Enviar"
            className="bg-gray-900 text-yellow-400 p-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <IoIosSend size={18} />
          </button>

          <button
            title="Enviado"
            className={` ${
              emailData.ready
                ? "bg-green-600 text-green-950 hover:bg-green-800 "
                : "bg-gray-900 text-green-400 hover:bg-gray-800"
            }   p-2 rounded-md  transition-colors`}
            onClick={() => {
              checkEmail(emailData.id, emailData.ready ? false : true);
            }}
          >
            <FaCheck size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/*
Hola Buenas Tardes me quiero ofrecer para trabajar, Tengo experiencia en repositor, limpieza, cajero, Vendedor, tengo el carnet de manipulacion de alimentos y tengo estudios en informatica y sistemas Web.
Le adjunto mi cv y espero su repuesta Gracias
*/
export default CardEmail;
