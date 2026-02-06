function Ayuda() {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-300 space-y-6">

      <h2 className="text-cyan-400 font-semibold text-2xl">
        Ayuda – Configuración de Gmail
      </h2>

      <p className="text-sm text-gray-400">
        Para que <span className="text-cyan-400 font-medium">CarterosBots</span> 
        pueda enviar correos desde tu cuenta de Gmail, necesitás generar un
        <span className="text-cyan-400 font-medium"> código de aplicación</span>.
        Este código es seguro y no es tu contraseña normal.
      </p>

      {/* PASO 1 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-yellow-400 font-semibold mb-2">
          1️⃣ Activar verificación en dos pasos
        </h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Entrá a <span className="text-cyan-400">https://myaccount.google.com</span></li>
          <li>Andá a <b>Seguridad</b></li>
          <li>Activá la <b>Verificación en dos pasos</b></li>
        </ul>
      </div>

      {/* PASO 2 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-yellow-400 font-semibold mb-2">
          2️⃣ Crear contraseña de aplicación
        </h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Dentro de <b>Seguridad</b>, buscá <b>Contraseñas de aplicaciones</b></li>
          <li>Elegí:
            <ul className="ml-5 list-disc">
              <li>Aplicación: <b>Correo</b></li>
              <li>Dispositivo: <b>Otro</b> → CarterosBots</li>
            </ul>
          </li>
          <li>Google te va a mostrar un código de 16 caracteres</li>
        </ul>
      </div>

      {/* PASO 3 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-yellow-400 font-semibold mb-2">
          3️⃣ Guardar el código en CarterosBots
        </h3>
        <p className="text-sm space-y-2">
          Dentro de la aplicación:
        </p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Entrá a <b>Usuarios</b></li>
          <li>Hacé clic en <b>Crear nuevo usuario</b></li>
          <li>Completá el nombre y el email</li>
          <li>Pegá el <b>código de Gmail</b></li>
          <li>Presioná <b>Guardar usuario</b></li>
        </ul>
      </div>

      {/* SEGURIDAD */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-sm">
        🔐 <b>Seguridad del código</b>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>El código se guarda <b>solo en tu computadora</b></li>
          <li>Se almacena de forma <b>encriptada</b></li>
          <li>Nunca se envía a internet ni a servidores externos</li>
          <li>Solo se usa para enviar emails desde la app</li>
        </ul>
      </div>

      {/* NOTA FINAL */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm">
        ⚠️ <b>Importante</b>
        <br />
        • No es tu contraseña real de Gmail  
        <br />
        • Podés revocar el código cuando quieras desde Google  
        <br />
        • Si lo eliminás de la app, deja de funcionar inmediatamente
      </div>

    </div>
  );
}

export default Ayuda;
