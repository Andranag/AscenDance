import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useToast = () => {
  const showToast = useCallback((message, type = 'success', options = {}) => {
    const defaultOptions = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    };

    const finalOptions = { ...defaultOptions, ...options };

    switch (type) {
      case 'success':
        return toast.success(message, finalOptions);
      case 'error':
        return toast.error(message, finalOptions);
      case 'warning':
        return toast.warning(message, finalOptions);
      case 'info':
        return toast.info(message, finalOptions);
      default:
        return toast(message, finalOptions);
    }
  }, []);

  return {
    success: (message, options) => showToast(message, 'success', options),
    error: (message, options) => showToast(message, 'error', options),
    warning: (message, options) => showToast(message, 'warning', options),
    info: (message, options) => showToast(message, 'info', options),
    showToast,
  };
};
