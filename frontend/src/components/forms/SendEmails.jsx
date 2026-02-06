function SendEmail() {
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const addEmail = () => {
    if (!emailInput) return;
    if (emails.includes(emailInput)) return;

    setEmails([...emails, emailInput]);
    setEmailInput("");
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter((e) => e !== emailToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emails.length === 0) {
      alert("Agregá al menos un email");
      return;
    }

    const response = await fetch("http://localhost:3000/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emails: emails,
        subject: subject,
        message: message,
      }),
    });

    if (response.ok) {
      alert("Correos enviados exitosamente");
      setEmails([]);
      setSubject("");
      setMessage("");
    } else {
      alert("Error al enviar los correos");
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-lg"
      >
        <h1 className="text-cyan-400 text-2xl font-semibold mb-6 text-center">
          Enviar CV por correo
        </h1>

        {/* Email input */}
        <label className="block text-cyan-300 mb-1">Emails destino</label>
        <div className="flex gap-2 mb-3">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="empresa@correo.com"
            className="flex-1 px-3 py-2 rounded-md bg-gray-900 text-cyan-200 placeholder-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="button"
            onClick={addEmail}
            className="px-3 rounded-md bg-gray-700 text-yellow-400 hover:bg-gray-600"
          >
            Agregar
          </button>
        </div>

        {/* Lista de emails */}
        {emails.length > 0 && (
          <ul className="mb-4 space-y-2">
            {emails.map((email) => (
              <li
                key={email}
                className="flex justify-between items-center bg-gray-900 px-3 py-2 rounded-md text-cyan-200"
              >
                <span>{email}</span>
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Asunto */}
        <label className="block text-cyan-300 mb-1">Asunto</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Postulación laboral"
          className="w-full mb-4 px-3 py-2 rounded-md bg-gray-900 text-cyan-200 placeholder-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />

        {/* Mensaje */}
        <label className="block text-cyan-300 mb-1">Mensaje</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="5"
          placeholder="Hola, les envío mi CV para su consideración..."
          className="w-full mb-6 px-3 py-2 rounded-md bg-gray-900 text-cyan-200 placeholder-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          required
        />

        {/* Botón */}
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-gray-900 text-yellow-400 font-semibold hover:bg-gray-700 transition-colors"
        >
          Enviar correos
        </button>
      </form>
    </div>
  );
}

export default SendEmail;
