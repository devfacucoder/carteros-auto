import { MdWarningAmber, MdClose } from "react-icons/md";
import useNoti from "../../hooks/useNotis";
function Alert({
  type = "error",
  title = "Mensaje de alerta",
  message = null,
  onConfirm = null,
  onFun = null,
  onClose,
}) {
  const { createNoti } = useNoti();
  if (type === "error") {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-[420px] bg-gray-900 rounded-xl shadow-2xl border border-gray-800 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
              <MdWarningAmber size={20} />
              {title}
            </h2>

            <button
              onClick={() => {
                onClose(false);
              }}
              className="text-gray-400 hover:text-red-400 transition"
            >
              <MdClose size={20} />
            </button>
          </div>

          {/* BODY */}
          <div className="px-6 py-5 text-sm text-gray-300">
            {message || "¿Estás seguro de que querés continuar?"}
          </div>
          <div className="border-t border-gray-800 px-6 py-4 flex gap-3">
            <button
              onClick={() => {
                createNoti("Operación realizada con éxito", "success");
                onFun();
              }}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 transition text-black font-semibold py-2 rounded-lg"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (type === "comfirm") {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-[420px] bg-gray-900 rounded-xl shadow-2xl border border-gray-800 flex flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
              <MdWarningAmber size={20} />
              {title}
            </h2>

            <button
              onClick={() => {
                onClose(false);
              }}
              className="text-gray-400 hover:text-red-400 transition"
            >
              <MdClose size={20} />
            </button>
          </div>

          {/* BODY */}
          <div className="px-6 py-5 text-sm text-gray-300">
            {message || "¿Estás seguro de que querés continuar?"}
          </div>

          {/* FOOTER */}
          <div className="border-t border-gray-800 px-6 py-4 flex gap-3">
            <button
              onClick={() => {
                onFun();
              }}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 transition text-black font-semibold py-2 rounded-lg"
            >
              Aceptar
            </button>

            <button
              onClick={() => {
                onClose(false);
              }}
              className="flex-1 bg-gray-800 hover:bg-red-800 transition text-gray-300 py-2 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Alert;
