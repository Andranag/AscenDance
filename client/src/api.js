export const API_BASE_URL = 'http://localhost:3050';

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
    
    const data = await response.json();
    
    // Handle different response formats
    if (data && typeof data === 'object') {
      // If data is an array, return it directly
      if (Array.isArray(data)) return data;
      
      // If data has a data property, return that
      if (data.data) return data.data;
      
      // If data has success and data properties, return data
      if (data.success && data.data) return data.data;
      
      // If data is an object with courses, return courses array
      if (data.courses) return data.courses;
    }
    
    // If we get here, return the raw data
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authenticated API functions
export const fetchAuth = async (endpoint, config = {}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...config.headers
      }
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'An error occurred');
    }
    
    const data = await response.json();
    // Return the full response object instead of just data
    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  fetchPublic
};