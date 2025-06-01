import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

export const createAPIInstance = (token) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });

  // Add request interceptor
  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        // Handle different error statuses
        switch (error.response.status) {
          case 401:
            // Handle unauthorized
            break;
          case 403:
            // Handle forbidden
            break;
          case 404:
            // Handle not found
            break;
          case 500:
            // Handle server error
            break;
          default:
            break;
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = {
  // Auth endpoints
  login: (credentials) => {
    return createAPIInstance().post('/auth/login', credentials);
  },
  register: (userData) => {
    return createAPIInstance().post('/auth/register', userData);
  },
  refresh: (token) => {
    return createAPIInstance(token).post('/auth/refresh');
  },

  // Course endpoints
  getCourses: () => {
    return createAPIInstance().get('/courses');
  },
  getCourse: (id) => {
    return createAPIInstance().get(`/courses/${id}`);
  },
  createCourse: (data, token) => {
    return createAPIInstance(token).post('/courses', data);
  },
  updateCourse: (id, data, token) => {
    return createAPIInstance(token).put(`/courses/${id}`, data);
  },
  deleteCourse: (id, token) => {
    return createAPIInstance(token).delete(`/courses/${id}`);
  },

  // User endpoints
  getUser: (id, token) => {
    return createAPIInstance(token).get(`/users/${id}`);
  },
  updateUser: (id, data, token) => {
    return createAPIInstance(token).put(`/users/${id}`, data);
  }
};

export default api;
