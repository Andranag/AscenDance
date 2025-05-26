import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

const ToastContainer = ({ toasts, removeToast }) => {
  const getErrorMessage = (error) => {
    if (!error) return 'An unexpected error occurred. Please try again.';
    
    if (typeof error === 'string') return error;
    
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.response?.status) {
      switch (error.response.status) {
        case 401:
          return 'Unauthorized. Please login again.';
        case 403:
          return 'Access denied. You don\'t have permission to perform this action.';
        case 404:
          return 'Resource not found.';
        default:
          return error.response.statusText || 'Server error occurred.';
      }
    }
    
    if (error.message) {
      if (error.message === 'Network Error') {
        return 'Network error. Please check your internet connection.';
      }
      if (error.message === 'timeout') {
        return 'Request timed out. Please try again later.';
      }
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 1000,
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            backgroundColor: {
              error: '#ff4444',
              success: '#4caf50',
              warning: '#ffa500',
              info: '#2196f3'
            }[toast.type],
            color: 'white',
            padding: '12px 24px',
            borderRadius: 4,
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 300
          }}
        >
          <span>{toast.message}</span>
          {toast.showCloseButton && (
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: 0,
                marginLeft: 8
              }}
              onClick={() => removeToast(toast.id)}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'error', options = {}) => {
    const id = Date.now();
    const toast = {
      id,
      message,
      type,
      duration: options.duration || 5000,
      showCloseButton: options.showCloseButton !== false
    };
    setToasts(prev => [...prev, toast]);

    // Automatically remove toast after specified duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toastError = (error, options = {}) => {
    const message = typeof error === 'string' ? error : getErrorMessage(error);
    return addToast(message, 'error', options);
  };

  const toastSuccess = (message, options = {}) => {
    return addToast(message, 'success', options);
  };

  const toastWarning = (message, options = {}) => {
    return addToast(message, 'warning', options);
  };

  const toastInfo = (message, options = {}) => {
    return addToast(message, 'info', options);
  };

  return (
    <ToastContext.Provider value={{
      toastError,
      toastSuccess,
      toastWarning,
      toastInfo,
      addToast,
      removeToast
    }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
