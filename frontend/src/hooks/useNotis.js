import { useContext, useCallback } from "react";
import { notiContext } from "../App";

function useNoti() {
  const { notisList, setNotiList } = useContext(notiContext);
  const createNoti = useCallback((message, type) => {
    const id = crypto.randomUUID();
    setNotiList((prev) => [...prev, { id, message, type }]);
  }, [setNotiList]);
  const closeNoti = useCallback((id) => {
    setNotiList((prev) => prev.filter((n) => n.id !== id));
  }, [setNotiList]);

  return {
    createNoti,
    closeNoti,
  };
}

export default useNoti;
