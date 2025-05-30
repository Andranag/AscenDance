import React from 'react';
import { X } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  onConfirm, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'default',
  icon
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${
        type === 'danger' ? 'border border-red-500' : ''
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: type === 'danger' ? '#ef4444' : '#1f2937' }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {icon && (
            <div className="flex justify-center mb-4">
              {icon}
            </div>
          )}
          
          <p className={`text-lg ${
            type === 'danger' ? 'text-red-600' : 'text-gray-600'
          } mb-8`}>
            {message}
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-6 py-2 text-sm font-medium ${
                type === 'danger' ? 'text-white bg-red-500 hover:bg-red-600' : 'text-white bg-primary hover:bg-primary/90'
              } rounded-lg`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
