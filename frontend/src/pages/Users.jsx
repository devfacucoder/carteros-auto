import { createContext, useState, useEffect, useContext } from "react";
import { FaUser, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import useNoti from "../hooks/useNotis";
import Alert from "../components/layout/Alert";
import ModalUserDatos from "../components/forms/ModalUserDatos";
import useCRUDEmail from "../hooks/useCRUDEmail";
const UserContext = createContext();

function ItemUserTR({ user, onEdit, onDelete }) {
  const { createNoti } = useNoti();
  const { deleteEmail } = useCRUDEmail();
  return (
    <tr className="hover:bg-gray-950 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-800 rounded-full flex items-center justify-center">
            <FaUser className="text-cyan-300" size={14} />
          </div>
          <div>
            <div className="text-cyan-300 font-medium">{user.nombre}</div>
            <div className="text-gray-500 text-xs">
              {user.email || "Sin email configurado"}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-center">
        <span className="bg-cyan-900 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full">
          {user.emails?.length || 0}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            className="text-cyan-400 hover:text-cyan-300 p-2 hover:bg-cyan-500/10 rounded transition-colors"
            title="Editar"
            onClick={() => onEdit(user)}
          >
            <FaEdit size={16} />
          </button>
          <button
            className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded transition-colors"
            title="Eliminar"
            onClick={() => onDelete(user)}
          >
            <FaTrash size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const { createNoti } = useNoti();

  useEffect(() => {
    const savedUsers = localStorage.getItem("usuarios");
    if (savedUsers) {
      try {
        setUsuarios(JSON.parse(savedUsers));
      } catch (e) {
        console.error("Error parsing users", e);
      }
    }
  }, []);

  const saveToLocalStorage = (newUsers) => {
    setUsuarios(newUsers);
    localStorage.setItem("usuarios", JSON.stringify(newUsers));
    // Notificar a otros componentes (Aside) que hubo cambios
    window.dispatchEvent(new Event("storage"));
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteRequest = (user) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      // 1. Borrar localmente (optimista)
      const updatedUsers = usuarios.filter((u) => u.id !== userToDelete.id);
      saveToLocalStorage(updatedUsers);
      setUserToDelete(null);
      createNoti("Usuario Eliminado con Éxito", "success");
      const emailsFiltrados = usuarios.map((u) => ({
        ...u,
        emails: u.emails.filter((e) => e.email !== userToDelete.email),
      }));
      for (const e of emailsFiltrados) {
        deleteEmail(e.id);
      }
      // 2. Borrar en backend
      try {
        const response = await fetch(
          `http://localhost:5178/users/${userToDelete.id}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          throw new Error("Error al borrar en el servidor");
        }
      } catch (error) {
        console.error("Error eliminando usuario en backend:", error);
        createNoti("Error al sincronizar borrado con el servidor", "error");
        // Opcional: Revertir cambios locales si falla
      }
    }
  };

  const handleSaveUser = async ({ nombre, email, cod }) => {
    if (editingUser) {
      // Editar
      const updatedUsers = usuarios.map((u) =>
        u.id === editingUser.id
          ? { ...u, nombre, email, cod } // Mantiene emails y otros campos si existen
          : u,
      );
      saveToLocalStorage(updatedUsers);
      createNoti("Usuario Editado con Éxito", "success");
    } else {
      // Crear
      const newUser = {
        id: Date.now().toString(), // ID único simple
        nombre,
        email,
        emails: [], // Lista de destinatarios vacía inicialmente
      };
      saveToLocalStorage([...usuarios, newUser]);
      createNoti("Usuario Creado con Éxito", "success");
      const response = await fetch("http://localhost:5178/save-user-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: newUser.id,
          gmailCode: cod,
          userName: nombre,
          email,
        }),
      });
      if (response.ok) {
        createNoti("Configuración guardada con Éxito", "success");
        localStorage.setItem("userSeleccionado", newUser.id);
      } else {
        createNoti("Error al guardar la configuración", "error");
      }
    }
    setShowModal(false);
  };

  return (
    <UserContext.Provider value={{ usuarios, setUsuarios }}>
      <div className="w-full min-h-screen bg-gray-950 text-cyan-300 p-6">
        {/* Alerta de confirmación para eliminar */}
        {userToDelete && (
          <Alert
            type="comfirm"
            title="Eliminar Usuario"
            message={`¿Estás seguro de eliminar al usuario ${userToDelete.nombre}?`}
            onFun={confirmDelete}
            onClose={() => setUserToDelete(null)}
          />
        )}

        {/* Modal de Crear/Editar */}
        {showModal && (
          <ModalUserDatos
            onClose={() => setShowModal(false)}
            onFun={handleSaveUser}
            initialData={editingUser}
          />
        )}

        {/* Header */}
        <div className="w-full h-24 bg-blue-950 rounded-xl flex items-center justify-between px-6 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-yellow-400">
              Gestión de Usuarios
            </h1>
            <p className="text-sm text-gray-400">
              {usuarios.length} {usuarios.length === 1 ? "usuario" : "usuarios"}{" "}
              registrados
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="btn_primary flex items-center gap-2 px-5 py-2"
          >
            <FaPlus size={14} />
            Nuevo Usuario
          </button>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-950 border-b border-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-yellow-400 uppercase">
                  Usuario
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-yellow-400 uppercase">
                  Destinatarios
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-yellow-400 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {usuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((user) => (
                  <ItemUserTR
                    key={user.id}
                    user={user}
                    onEdit={handleEdit}
                    onDelete={handleDeleteRequest}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default Users;
