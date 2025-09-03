"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false); // ✅ track if client is ready

  useEffect(() => {
    setMounted(true); // ✅ runs only in browser
  }, []);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* ✅ only render portal on client */}
      {mounted &&
        createPortal(
          <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
            {toasts.map((t) => (
              <div
                key={t.id}
                className={`px-4 py-2 rounded shadow-lg text-white text-sm animate-fade-in-down
                  ${t.type === "success" ? "bg-green-500" : ""}
                  ${t.type === "error" ? "bg-red-500" : ""}
                  ${t.type === "info" ? "bg-blue-500" : ""}`}
              >
                {t.message}
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
