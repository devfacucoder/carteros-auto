import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { app as electronApp } from "electron";
import { getActiveGmailCode, getActiveUser, getEmailActive } from "./config.js";
import { decrypt } from "./cryptoUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../backend/.env"),
});

// ✅ Crear transporter bajo demandafunction getTransporter() {
function getTransporter() {
  const user = getActiveUser();

  if (!user || !user.gmailCode) {
    throw new Error("Usuario activo sin Gmail configurado");
  }

  const decryptedCode = decrypt(user.gmailCode);
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user.email,
      pass: decryptedCode,
    },
  });
}
// ✅ Obtener ruta correcta del CV
const userDataPath = electronApp.getPath("userData");
const cvPath = path.join(userDataPath, "cv.pdf");
async function sendOneEmail({ to, subject, text, attachments }) {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.COD_EMAIL,
    to,
    subject,
    text,
    attachments,
  };

  return await transporter.sendMail(mailOptions);
}

// ✅ Helper para obtener path del PDF
export function getPdfPath(pdfName) {
  if (pdfName) {
    return {
      filename: pdfName,
      path: path.join(userDataPath, "pdfs", pdfName),
    };
  }
  return {
    filename: "CV-Facundo-Ferreyra.pdf",
    path: cvPath,
  };
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function enviarEmails(emails, socket) {
  if (!emails || !Array.isArray(emails)) {
    console.error("enviarEmails recibió datos inválidos:", emails);
    return { enviado: 0, msgStatus: "Datos inválidos" };
  }

  let enviados = 0;
  let msgStatus = "Todo enviado correctamente";

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];

    try {
      // ✅ Lógica robusta para adjuntar PDF
      let pdfToAttach = cvPath;
      let pdfName = "CV-Facundo-Ferreyra.pdf";

      if (email.pdf) {
        const customPath = path.join(userDataPath, "pdfs", email.pdf);
        // Verificar si existe el archivo personalizado
        if (fs.existsSync(customPath)) {
          pdfToAttach = customPath;
          pdfName = email.pdf;
        } else {
          console.warn(
            `PDF personalizado no encontrado: ${email.pdf}. Usando default.`,
          );
        }
      }

      await sendOneEmail({
        to: email.email,
        subject: email.subject,
        text: email.message,
        attachments: [
          {
            filename: pdfName,
            path: pdfToAttach, // ✅ Usar cvPath de userData o el específico
          },
        ],
      });

      enviados++;

      socket?.emit("email-progress", {
        current: enviados,
        total: emails.length,
        sent: email.email,
      });

      if (i < emails.length - 1) {
        await delay(10_000);
      }
    } catch (error) {
      console.error("Error enviando:", email.email, error);
      msgStatus = "Hubo errores en el envío";
    }
  }

  socket?.emit("email-finished", {
    enviados,
    total: emails.length,
  });

  return { enviados, msgStatus };
}

export { sendOneEmail, enviarEmails };
