import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type) => {
    const id = `toast-${Date.now()}`;
    const newToast = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
    
    return id;
  };

  const toastSuccess = (message) => addToast(message, 'success');
  const toastError = (message) => addToast(message, 'error');
  const toastInfo = (message) => addToast(message, 'info');
  const toastWarning = (message) => addToast(message, 'warning');

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        toastSuccess,
        toastError,
        toastInfo,
        toastWarning,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};