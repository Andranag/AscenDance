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
  try {
    const token = localStorage.getItem('token');
    
    // Debug logging
    console.log('Token from fetchWithAuth:', token);
    console.log('Token type:', typeof token);
    console.log('Token length:', token?.length);
    
    if (!token) {
      throw new Error('No token found. Please login again.');
    }
    
    // Verify token format
    if (typeof token !== 'string' || token.length < 10) {
      console.error('Invalid token format:', token);
      throw new Error('Invalid token format. Please login again.');
    }
    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      ...options
    };
    
    console.log('Request config:', {
      endpoint: `${API_BASE_URL}${endpoint}`,
      headers: config.headers
    });
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log('Response status:', response.status);
    
    // Read the response body once
    const text = await response.text();
    console.log('Raw response text:', text);
    
    // Try to parse as JSON if possible
    let data;
    try {
      data = text ? JSON.parse(text) : null;
      console.log('Parsed response data:', data);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      data = null;
    }
    
    // Log the complete response object
    console.log('Complete response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      text,
      data
    });
    
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
      if (data?.error === 'token_expired') {
        throw new Error('Token expired. Please login again.');
      }
      
      // Handle user not found case
      if (data?.error === 'user_not_found') {
        throw new Error('User no longer exists. Please login again.');
      }
      
      // Handle other error cases
      if (data?.error) {
        throw new Error(data.message || `API error: ${data.error}`);
      }
      
      throw new Error(`API error: ${response.statusText}`);
    }
    
    // Handle nested response structure
    if (data?.success && data?.data) {
      data = data.data;
    }
    
    // Return the parsed data
    return {
      data: data || {},
      status: response.status,
      statusText: response.statusText
    };
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
    console.log('Public API response text:', text);
    
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      data = null;
    }
    
    if (!response.ok) {
      throw new Error(data?.message || `API error: ${response.statusText}`);
    }
    
    // Always return the full response object
    return {
      success: response.ok,
      data: data || {},
      status: response.status
    };
  } catch (error) {
    console.error('Public API error:', {
      error,
      message: error.message,
      name: error.name
    });
    throw error;
  }
};

export default { fetchWithAuth, fetchPublic };
