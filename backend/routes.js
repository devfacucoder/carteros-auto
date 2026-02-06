import { Router } from "express";
import dotenv from "dotenv";
import {
  enviarEmails,
  sendOneEmail,
  getPdfPath,
} from "./emailer.js";

dotenv.config();
const router = Router();

/* TEST */
router.get("/", (req, res) => {
  res.send("Ruta principal funcionando");
});

/* UN EMAIL */
router.post("/sendone", async (req, res) => {
  try {
    const { email, subject, message, pdf } = req.body;

    const attachment = getPdfPath(pdf);

    const dataForSend = {
      from: process.env.COD_EMAIL,
      to: email,
      subject,
      text: message,
      attachments: [attachment],
    };

    await sendOneEmail(dataForSend);

    res.json({ ok: true, message: "Correo enviado" });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
/* MULTIPLES */
router.post("/send", async (req, res) => {
  const { ojects } = req.body;

  if (!ojects || ojects.length === 0) {
    return res.status(400).send("No hay emails para enviar");
  }

  const dataForSend = ojects.map((email) => ({
    from: process.env.COD_EMAIL,
    to: email.email,
    subject: email.subject,
    text: email.message,
    pdf: email.pdf,
  }));

  const enviados = await enviarEmails(dataForSend);

  res.json({ total: dataForSend.length, enviados });
});
import { saveConfig, getConfig, addUser, setActiveUser,deleteUser } from "./config.js";
import { encrypt, decrypt } from "./cryptoUtils.js";

router.post("/save-user-config", (req, res) => {
  const { id, userName, gmailCode, email } = req.body;
  // Encriptar el gmailCode
  const encryptedCode = encrypt(gmailCode);

  const user = addUser({ id, userName, email, gmailCode: encryptedCode });
  res.json(user);
});

router.delete("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  deleteUser(userId);
  res.json({ ok: true });
});

router.get("/users", (req, res) => {
  res.json(getConfig().users);
});

router.post("/users/active", (req, res) => {
  setActiveUser(req.body.userId);
  res.json({ ok: true });
});

export default router;
