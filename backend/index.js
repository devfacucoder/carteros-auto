import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { app as electronApp } from "electron";
import fs from "fs";

import { getConfig, saveConfig } from "./config.js";

const config = getConfig();

import router from "./routes.js";
import { sendOneEmail, enviarEmails } from "./emailer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../backend/.env"),
});

export function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5178;

  app.use(express.json());
  app.use(cors({ origin: "*" }));
  app.use("/", router);

  /* ======================================================
     📂 RUTAS CORRECTAS PARA CV
  ====================================================== */

  // 📁 Carpeta ESCRIBIBLE (userData)
  const userDataPath = electronApp.getPath("userData");

  // 📁 Crear carpeta "pdfs" si no existe
  const pdfsFolder = path.join(userDataPath, "pdfs");
  if (!fs.existsSync(pdfsFolder)) {
    fs.mkdirSync(pdfsFolder, { recursive: true });
  }

  // CV por defecto
  const cvDefaultPath = path.join(__dirname, "cv.pdf");
  const cvUserPath = path.join(pdfsFolder, "cv.pdf");

  // ✅ Al iniciar, copiar CV por defecto si no existe
  if (!fs.existsSync(cvUserPath) && fs.existsSync(cvDefaultPath)) {
    fs.copyFileSync(cvDefaultPath, cvUserPath);
  }


  /* ======================================================
     📤 MULTER - GUARDAR CON NOMBRE PERSONALIZADO
  ====================================================== */
  /* ======================================================
   📤 MULTER - GUARDAR CON NOMBRE PERSONALIZADO
====================================================== */

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, pdfsFolder);
    },
    filename: (req, file, cb) => {
      // 👇 Guardar temporalmente con nombre único
      cb(null, `temp-${Date.now()}.pdf`);
    },
  });

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== "application/pdf") {
        cb(new Error("Solo se permiten archivos PDF"));
      } else {
        cb(null, true);
      }
    },
  });

  // 📤 Subir CV con nombre personalizado
  app.post("/upload-cv", upload.single("cv"), (req, res) => {
    try {
      const tempPath = req.file.path;

      // 👇 Obtener nombre personalizado desde el body
      const customName =
        req.body.nombre || req.file.originalname.replace(".pdf", "");

      // 👇 Asegurar que termine en .pdf
      const finalName = customName.endsWith(".pdf")
        ? customName
        : `${customName}.pdf`;

      const finalPath = path.join(pdfsFolder, finalName);

      // 👇 Renombrar el archivo temporal al nombre final
      fs.renameSync(tempPath, finalPath);


      res.json({
        ok: true,
        path: finalPath,
        filename: finalName,
      });
    } catch (error) {
      console.error("Error al subir PDF:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });
  // 📋 Listar todos los PDFs guardados
  app.get("/list-pdfs", (req, res) => {
    try {
      const files = fs
        .readdirSync(pdfsFolder)
        .filter((file) => file.endsWith(".pdf"))
        .map((file) => ({
          name: file,
          path: path.join(pdfsFolder, file),
        }));

      res.json({ ok: true, pdfs: files });
    } catch (error) {
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // 🗑️ Eliminar un PDF específico
  app.delete("/delete-pdf/:filename", (req, res) => {
    try {
      const filePath = path.join(pdfsFolder, req.params.filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ ok: true, message: "PDF eliminado" });
      } else {
        res.status(404).json({ ok: false, message: "PDF no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  /* ======================================================
     📧 SOCKET + EMAILS
  ====================================================== */

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {

    socket.on("sendoneemail", async (data) => {
      try {
        const files = fs
          .readdirSync(pdfsFolder)
          .filter((file) => file.endsWith(".pdf"))
          .map((file) => ({
            name: file,
            path: path.join(pdfsFolder, file),
          }));
        // 👇 Puedes especificar qué PDF adjuntar
        const pdfToAttach = data.pdf
          ? path.join(pdfsFolder, data.pdf)
          : cvUserPath; // Por defecto usa cv.pdf
        await sendOneEmail({
          to: data.to,
          subject: data.subject,
          text: data.text,
          attachments: [
            {
              filename: data.pdf || "CV-Facundo-Ferreyra.pdf",
              path: pdfToAttach,
            },
          ],
        });

        socket.emit("email-status", {
          success: true,
          files: files,
          message: "Email enviado correctamente",
        });
      } catch (error) {
        socket.emit("email-status", {
          success: false,
          message: error.message,
        });
      }
    });

    socket.on("send-multiple-emails", async (data) => {
      // Se reciben los emails con sus propiedades individuales (incluyendo pdf)
      // data.emails contiene el array de correos con { email, subject, message, pdf }
      const emailsList = Array.isArray(data) ? data : data.emails || [];
      await enviarEmails(emailsList, socket);
    });
  });

  server.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
}
