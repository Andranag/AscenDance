import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => {
        const getToastClasses = () => {
          const baseClasses = "flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 opacity-100 w-full backdrop-blur-sm";
          
          switch (toast.type) {
            case 'success':
              return `${baseClasses} bg-emerald-50/95 text-emerald-700 border-l-4 border-emerald-500`;
            case 'error':
              return `${baseClasses} bg-red-50/95 text-red-700 border-l-4 border-red-500`;
            case 'warning':
              return `${baseClasses} bg-amber-50/95 text-amber-700 border-l-4 border-amber-500`;
            case 'info':
            default:
              return `${baseClasses} bg-blue-50/95 text-blue-700 border-l-4 border-blue-500`;
          }
        };

        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle className="w-5 h-5 mr-3" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 mr-3" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 mr-3" />;
            case 'info':
            default:
              return <Info className="w-5 h-5 mr-3" />;
          }
        };

        return (
          <div
            key={toast.id}
            className={getToastClasses()}
            role="alert"
            aria-live="assertive"
          >
            {getIcon()}
            <div className="flex-1 font-medium">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;