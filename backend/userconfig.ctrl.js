import fs from "fs";
import path from "path";
import { app } from "electron";

const configPath = path.join(
  app.getPath("userData"),
  "userconfig.json"
);

// si no existe, lo creamos
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(
    configPath,
    JSON.stringify({ coldownSend: 2000 }, null, 2)
  );
}

const user = JSON.parse(
  fs.readFileSync(configPath, "utf-8")
);

console.log(user.coldownSend);
