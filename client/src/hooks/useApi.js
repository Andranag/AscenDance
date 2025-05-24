import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../utils/tokenManager';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3050/api';

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        // Handle unauthorized error (e.g., redirect to login)
      } else if (error.response?.status === 403) {
        toast.error('Access denied.');
      } else if (error.response?.status === 404) {
        toast.error('Resource not found.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred. Please try again.');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const useApi = () => {
  const axiosInstance = createAxiosInstance();

  const makeRequest = useCallback(async (config) => {
    try {
      const response = await axiosInstance(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, [axiosInstance]);

  const get = useCallback(
    (url, config = {}) => {
      return makeRequest({ ...config, method: 'get', url });
    },
    [makeRequest]
  );

  const post = useCallback(
    (url, data, config = {}) => {
      return makeRequest({ ...config, method: 'post', url, data });
    },
    [makeRequest]
  );

  const put = useCallback(
    (url, data, config = {}) => {
      return makeRequest({ ...config, method: 'put', url, data });
    },
    [makeRequest]
  );

  const patch = useCallback(
    (url, data, config = {}) => {
      return makeRequest({ ...config, method: 'patch', url, data });
    },
    [makeRequest]
  );

  const del = useCallback(
    (url, config = {}) => {
      return makeRequest({ ...config, method: 'delete', url });
    },
    [makeRequest]
  );

  return {
    get,
    post,
    put,
    patch,
    del,
  };
};
