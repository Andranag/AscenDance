import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

export const useApi = (apiFunction, { onSuccess, onError } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toastError } = useToast();

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err);
      toastError(err.message || 'An error occurred');
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError, toastError]);

  return {
    data,
    loading,
    error,
    execute,
  };
};