// Assignment/main-app/src/context/ToastContext.jsx

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = ++idCounter;
    const item = { id, title: '', description: '', variant: 'default', duration: 3000, ...toast };
    setToasts((prev) => [...prev, item]);
    if (item.duration) {
      setTimeout(() => remove(id), item.duration);
    }
    return id;
  }, [remove]);

  const value = useMemo(() => ({ push, remove }), [push, remove]);

  return (
    <ToastContext.Provider value={value}>
      <>
        {children}
        <div className="fixed inset-x-0 top-3 z-[100] flex justify-center px-3 pointer-events-none">
          <div className="w-full max-w-md space-y-2">
            {toasts.map((t) => (
              <div
                key={t.id}
                className={`pointer-events-auto rounded-lg border p-4 shadow-lg backdrop-blur bg-gray-800/90 border-gray-700 text-white flex items-start gap-3 ${
                  t.variant === 'success' ? 'border-green-500/40' : t.variant === 'error' ? 'border-red-500/40' : 'border-gray-700'
                }`}
              >
                <div className={`mt-1 h-2 w-2 rounded-full ${
                  t.variant === 'success' ? 'bg-green-400' : t.variant === 'error' ? 'bg-red-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1">
                  {t.title && <div className="font-semibold mb-0.5">{t.title}</div>}
                  {t.description && <div className="text-sm text-gray-300">{t.description}</div>}
                </div>
                <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-white">✕</button>
              </div>
            ))}
          </div>
        </div>
      </>
    </ToastContext.Provider>
  );
};
