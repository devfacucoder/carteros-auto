import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaChevronDown } from "react-icons/fa";
import { useState, useEffect } from "react";

function Aside() {
  const [selectedUser, setSelectedUser] = useState(
    localStorage.getItem("userSeleccionado") || "",
  );
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const activeUser = async (user) => {
    try {
      const response = await fetch("http://localhost:5178/users/active", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user }),
      });
      if (!response.ok) {
        throw new Error("Error activando usuario");
      }
      const data = await response.json();
      console.log("Usuario activado:", data);
    } catch (error) {
      console.error("Error activando usuario:", error);
    }
  };
  // Cargar usuarios al montar el componente
  useEffect(() => {
    const loadUsers = () => {
      const savedUsers = localStorage.getItem("usuarios");
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        setUsers([]);
      }
    };

    loadUsers();

    // Escuchar cambios en localStorage (cuando se agregan/editan usuarios)
    const handleStorageChange = () => {
      loadUsers();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleUserChange = (e) => {
    const newUser = e.target.value;
    setSelectedUser(newUser);
    localStorage.setItem("userSeleccionado", newUser);

    // 👇 Disparar evento personalizado
    window.dispatchEvent(new Event("userChanged"));
    activeUser(newUser);
    console.log("Usuario seleccionado:", newUser);
  };
  return (
    <aside className="min-h-screen w-[15%] bg-gray-900 border-r border-cyan-800 flex flex-col">
      {/* Título / Logo */}
      <div className="px-4 py-4 border-b border-cyan-800">
        <h2 className="text-cyan-400 font-semibold text-lg">Carteros Auto</h2>
        <p className="text-cyan-600 text-xs mb-3">Envío automático</p>

        {/* Select de Usuarios */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <FaUser className="text-yellow-400" size={12} />
          </div>
          <select
            value={selectedUser}
            onChange={handleUserChange}
            className="w-full bg-gray-800 border border-gray-700 text-yellow-400 text-sm rounded-md pl-8 pr-8 py-2 appearance-none cursor-pointer hover:border-cyan-600 focus:outline-none focus:border-cyan-500 transition-colors"
          >
            {users.length === 0 ? (
              <option value="">Sin usuarios</option>
            ) : (
              users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nombre}
                </option>
              ))
            )}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <FaChevronDown className="text-yellow-400" size={10} />
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-2 py-4">
        <ul className="flex flex-col gap-1 text-sm">
          <li>
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-yellow-400 hover:bg-gray-800 hover:text-yellow-300 transition-colors"
            >
              Inicio
            </Link>
          </li>

          <li>
            <Link
              to="/config"
              className="block px-3 py-2 rounded-md text-yellow-400 hover:bg-gray-800 hover:text-yellow-300 transition-colors"
            >
              Configuración
            </Link>
          </li>
          <li>
            <Link
              to="/users"
              className="block px-3 py-2 rounded-md text-yellow-400 hover:bg-gray-800 hover:text-yellow-300 transition-colors"
            >
              Usuarios
            </Link>
          </li>

          <li>
            <Link
              to="/ayuda"
              className="block px-3 py-2 rounded-md text-yellow-400 hover:bg-gray-800 hover:text-yellow-300 transition-colors"
            >
              Ayuda
            </Link>
          </li>

          <li>
            <Link
              to="/acerca"
              className="block px-3 py-2 rounded-md text-yellow-400 hover:bg-gray-800 hover:text-yellow-300 transition-colors"
            >
              Acerca de
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div
        onClick={() => {
          navigate("/snake");
        }}
        className="px-4 py-3 border-t border-cyan-800 text-cyan-600 text-xs"
      >
        v0.2.0-Beta
      </div>
    </aside>
  );
}

export default Aside;
