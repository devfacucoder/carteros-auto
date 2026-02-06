function About() {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-300 space-y-6">

      <h2 className="text-cyan-400 font-semibold text-2xl">
        Acerca de Carteros Auto
      </h2>

      <p className="text-sm text-gray-400 leading-relaxed">
        <span className="text-cyan-400 font-medium">Carteros Auto</span> es una
        aplicación de escritorio desarrollada para automatizar el envío de
        correos electrónicos de forma simple, segura y eficiente.
        Está pensada para usuarios que necesitan enviar múltiples emails con
        adjuntos, gestionar usuarios y mantener el control total desde su propia PC.
      </p>

      
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2 text-sm">
        <p>
          🧩 <b>Tipo de aplicación:</b> Desktop (Electron)
        </p>
        <p>
          ⚙️ <b>Tecnologías:</b> Electron · React · Node.js · Express · Socket.io
        </p>
        <p>
          🔐 <b>Seguridad:</b> Datos locales + credenciales encriptadas
        </p>
        <p>
          📦 <b>Almacenamiento:</b> Local (userData del sistema)
        </p>
      </div>

      {/* VERSION */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm">
        📌 <b>Versión:</b> <span className="text-cyan-400">v0.2.0-Beta</span>
      </div>

      {/* LINKS */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-yellow-400 font-semibold mb-3">
          Enlaces
        </h3>

        <ul className="space-y-2 text-sm">
          <li>
            📂 Repositorio del proyecto:{" "}
            <a
              href="https://github.com/devfacucoder/carteros-auto.git"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline"
            >
              (link al repositorio)
            </a>
          </li>

          <li>
            👤 Instagram del creador:{" "}
            <a
              href="https://www.instagram.com/facuferreyrafm/"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline"
            >
              (link a Instagram)
            </a>
          </li>

          <li>
            💼 LinkedIn del creador:{" "}
            <a
              href="https://www.linkedin.com/in/facundoferreyradev/"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline"
            >
              (link a LinkedIn)
            </a>
          </li>

          <li>
            🧠 GitHub del creador:{" "}
            <a
              href="https://github.com/devfacucoder"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline"
            >
              (link a GitHub)
            </a>
          </li>
        </ul>
      </div>

      {/* FOOTER */}
      <div className="text-xs text-gray-500 text-center">
        © {new Date().getFullYear()} CarterosBots – Desarrollado en Argentina 🇦🇷
      </div>

    </div>
  );
}

export default About;
