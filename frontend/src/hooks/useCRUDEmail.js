import { useContext } from "react";
import { emailContext } from "../App";

function useCRUDEmail() {
  const { emails, setEmails } = useContext(emailContext);

  const createEmail = ({
    email = "",
    subject = "",
    message = "",
    pdf = "",
  }) => {
    const userSelect =
      localStorage.getItem("userSeleccionado") || "defaultUser";
    const newEmail = {
      id: crypto.randomUUID(),
      email,
      subject,
      message,
      ready: true,
      status: "pending",
      pdf,
      timeSent: 0,
      lastTimeSent: null,
      user: userSelect,
      createdAt: new Date().toISOString(),
    };

    const updatedEmails = [...emails, newEmail];
    setEmails(updatedEmails);
    localStorage.setItem("emails", JSON.stringify(updatedEmails));
  };

  // 🆕 CREAR MUCHOS EMAILS (batch)
  const createManyEmails = (emailsArray = []) => {
    setEmails((prev) => {
      // evitar duplicados (basado en el email address)
      const existingEmails = new Set(prev.map((e) => e.email));
      const userSelect =
        localStorage.getItem("userSeleccionado") || "defaultUser";

      const nuevos = emailsArray
        .map((item) => {
          // Si es string, convertir a objeto
          if (typeof item === "string") {
            return {
              email: item,
              subject: "",
              message: "",
              pdf: null,
            };
          }
          // Si ya es objeto, usarlo
          return item;
        })
        .filter((item) => !existingEmails.has(item.email))
        .map((item) => ({
          id: crypto.randomUUID(),
          email: item.email,
          subject: item.subject || "",
          message: item.message || "",
          ready: true,
          status: "pending",
          timeSent: 0,
          user: userSelect,
          lastTimeSent: null,
          pdf: item.pdf || null, // Guardar pdf si viene
          createdAt: new Date().toISOString(),
        }));

      const merged = [...prev, ...nuevos];
      localStorage.setItem("emails", JSON.stringify(merged));
      return merged;
    });
  };

  const editEmail = (id, email, subject, message, pdf) => {
    const updatedEmails = emails.map((item) =>
      item.id === id
        ? {
            ...item,
            email,
            subject,
            message,
            pdf,
            updatedAt: new Date().toISOString(),
          }
        : item,
    );

    setEmails(updatedEmails);
    localStorage.setItem("emails", JSON.stringify(updatedEmails));
  };

  const deleteEmail = (id) => {
    const updatedEmails = emails.filter((item) => item.id !== id);
    setEmails(updatedEmails);
    localStorage.setItem("emails", JSON.stringify(updatedEmails));
  };

  const loadEmails = () => {
    const storedEmails = localStorage.getItem("emails");
    if (storedEmails) {
      setEmails(JSON.parse(storedEmails));
    }
  };

  const checkEmail = (id, value) => {
    const updateReady = emails.map((item) =>
      item.id === id ? { ...item, ready: value } : item,
    );
    setEmails(updateReady);
    localStorage.setItem("emails", JSON.stringify(updateReady));
  };

  const darAuthor = () => {
    const emails = JSON.parse(localStorage.getItem("emails")) || [];
    const userSeleccionado = localStorage.getItem("userSeleccionado");

    const emailsConUser = emails.map((item) => ({
      ...item,
      user: userSeleccionado,
    }));

    localStorage.setItem("emails", JSON.stringify(emailsConUser));
  };
  return {
    createEmail,
    createManyEmails, // 👈 exportada
    editEmail,
    deleteEmail,
    loadEmails,
    checkEmail,
    darAuthor,
  };
}

export default useCRUDEmail;
