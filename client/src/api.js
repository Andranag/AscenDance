const API_BASE_URL = 'http://localhost:3050';

// Enhanced error handling for API responses
const handleResponse = async (response) => {
  try {
    // Read the response body once
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response text:', text);
    console.log('Parsed response data:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      }
      
      // Handle token expired case
      if (data.error === 'token_expired') {
        throw new Error('Token expired. Please login again.');
      }
      
      // Handle user not found case
      if (data.error === 'user_not_found') {
        throw new Error('User no longer exists. Please login again.');
      }
      
      // Handle other error cases
      if (data.error) {
        throw new Error(data.message || `API error: ${data.error}`);
      }
      
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in handleResponse:', {
      error,
      message: error.message,
      name: error.name
    });
    throw error;
  }
};

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found in localStorage');
    throw new Error('No authentication token found');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    console.log('Making request to:', url);
    console.log('Request headers:', headers);
    
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });
    
    console.log('Response status:', response.status);
    
    // Read the response body once
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    
    console.log('Response data:', data);
    
    if (!response.ok) {
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      }
      
      throw new Error(data.message || `API error: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error('API error:', {
      error,
      message: error.message,
      name: error.name
    });
    throw error;
  }
};

export const fetchPublic = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include'
    });
    
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    
    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export default { fetchWithAuth, fetchPublic };
