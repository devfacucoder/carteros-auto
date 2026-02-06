import fs from "fs";
import path from "path";
import { app } from "electron";

const configPath = path.join(app.getPath("userData"), "config.json");
function initialConfig() {
  return {
    users: [],
    activeUserId: null,
  };
}

export function getConfig() {
  // 1️ Si no existe → crear
  if (!fs.existsSync(configPath)) {
    const config = initialConfig();
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return config;
  }

  // 2️ Existe → intentar leer
  try {
    const raw = fs.readFileSync(configPath, "utf-8");

    // Archivo vacío
    if (!raw.trim()) {
      const config = initialConfig();
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      return config;
    }

    const config = JSON.parse(raw);

    // Blindaje de estructura
    if (!Array.isArray(config.users)) config.users = [];
    if (!("activeUserId" in config)) config.activeUserId = null;

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return config;
  } catch (err) {
    // 🧨 JSON roto
    const config = initialConfig();
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return config;
  }
}

export function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function addUser({ id, userName, email, gmailCode }) {
  const config = getConfig();

  const newUser = {
    id,
    email,
    userName,
    gmailCode,
  };

  config.users.push(newUser);
  config.activeUserId = id;

  saveConfig(config);
  return newUser;
}
export function deleteUser(userId) {
  const config = getConfig();
  config.users = config.users.filter((user) => user.id !== userId);
  config.activeUserId = null;
  saveConfig(config);
}

export function setActiveUser(userId) {
  const config = getConfig();
  config.activeUserId = userId;
  saveConfig(config);
}

export function getActiveUser() {
  const config = getConfig();
  return config.users.find((user) => user.id === config.activeUserId) || null;
}

export function getActiveGmailCode() {
  const user = getActiveUser();
  return user ? user.gmailCode : null;
}
export function getEmailActive() {
  const user = getActiveUser();
  return user ? user.email : null;
}
