const API_BASE_URL = 'http://localhost:3050';

// Public API functions
export const fetchPublic = async (endpoint, config = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'An error occurred');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchWithAuth = async (endpoint, config = {}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...config.headers
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...config,
      headers
    });
    
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'An error occurred');
    }
    
    // Handle both nested and flat responses
    return responseData.data || responseData
  } catch (error) {
    throw error;
  }
};

// Auth API endpoints
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};