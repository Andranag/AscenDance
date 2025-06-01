export const showToast = (io, roomId, message, type = 'info') => {
  io.to(roomId).emit('toast', {
    message,
    type,
    timestamp: new Date().toISOString()
  });
};

export const showSuccessToast = (io, roomId, message) => {
  showToast(io, roomId, message, 'success');
};

export const showErrorToast = (io, roomId, message) => {
  showToast(io, roomId, message, 'error');
};

export const showInfoToast = (io, roomId, message) => {
  showToast(io, roomId, message, 'info');
};

export const showWarningToast = (io, roomId, message) => {
  showToast(io, roomId, message, 'warning');
};
