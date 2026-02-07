# 📬 Carteros Auto

> **"Automatizar la molestia"**

Carteros Auto es una aplicación de escritorio pensada para **automatizar la creación, gestión y envío de emails**, especialmente útil para enviar **currículums de forma repetida y organizada** sin tener que rehacer todo todos los días.

---

## 🚀 ¿Qué es Carteros Auto?

Carteros Auto nace como un **proyecto personal** para resolver un problema muy concreto: el desgaste de crear y enviar múltiples correos una y otra vez.

La app permite **guardar varios emails**, organizarlos por usuario y **reenviarlos fácilmente** usando un **código de Gmail (App Password)** de forma **local y segura**.

Está pensada principalmente para **uso personal**, aunque el proyecto es **open source** y acepta contribuciones.

---

## ✨ Funcionalidades

### 📧 Emails

* CRUD completo de emails
* Envío de **uno o varios emails** en un solo paso
* Posibilidad de reutilizar correos guardados
* Exportación de datos de emails

### 👤 Usuarios

* CRUD de usuarios
* Separación de emails por usuario
* Cada usuario tiene su propio código de Gmail

### 🔐 Seguridad

* Uso exclusivo de **App Passwords de Gmail**
* Código de Gmail **encriptado**
* Los datos **no se envían a servidores externos**
* Todo se guarda localmente en la PC del usuario

### 📂 Almacenamiento local

* Emails simples → `localStorage`
* PDFs adjuntos → carpeta `pdfs/`
* Usuarios + códigos encriptados → `config.json`

### 🔔 Extras

* Sistema de notificaciones
* Socket.IO en tiempo real
* Easter egg oculto 🐍

---

## 🧱 Arquitectura del proyecto

```
Carteros Auto
├── electron/        # Proceso principal de Electron
├── frontend/        # React + Vite + Tailwind
│   └── dist/        # Build del frontend
├── backend/         # Node.js + Express + Nodemailer
├── pdfs/            # PDFs guardados localmente
├── config.json      # Usuarios + códigos encriptados
└── package.json
```

**Comunicación:**

* Frontend ↔ Backend mediante HTTP y Socket.IO
* Backend corre localmente junto con Electron

---

## 🛠️ Tecnologías usadas

* **Electron** – App de escritorio
* **React + Vite** – Frontend
* **TailwindCSS** – Estilos
* **Node.js** – Backend
* **Express** – API local
* **Nodemailer** – Envío de emails
* **Socket.IO** – Comunicación en tiempo real

---

## 📦 Instalación

### 🖥️ Usuario final (Windows)

1. Descargar el instalador `.exe`
2. Ejecutarlo
3. Configurar un usuario con su código de Gmail
4. Crear emails y empezar a enviar

> ⚠️ Solo disponible para **Windows** por el momento

---

### 👨‍💻 Modo desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/devfacucoder/carteros-auto
cd carteros-auto

# Instalar dependencias
npm install

# Frontend
cd frontend
npm install
npm run dev

# Volver a la raíz y correr Electron
npm run dev
```

---

## 🔐 Variables de entorno

Crear un archivo `.env`:

```env
SECRET_KEY=tu_clave_secreta
PORT=3000
```

* `SECRET_KEY`: usada para encriptar el código de Gmail
* `PORT`: puerto del backend local

---

## 🧪 Estado del proyecto

* Versión actual: **0.2.0-beta**
* Proyecto activo y en desarrollo

---

## 🛣️ Roadmap (futuras mejoras)

* Base de datos SQL local
* Asistencia con IA para redactar mensajes
* Buscador avanzado de emails
* Programación automática de envíos

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas 🙌

* Issues
* Pull Requests
* Ideas y sugerencias

---

## 👤 Autor

Creado por **Facundo**

* GitHub: [link]
* Instagram: [link]
* LinkedIn: [link]

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.

---

## ⚠️ Disclaimer

Esta aplicación utiliza **App Passwords de Gmail**.

El uso indebido o spam masivo puede violar las políticas de Google. Usar de forma responsable.
