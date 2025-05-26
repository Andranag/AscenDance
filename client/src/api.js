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
    
    // Log the complete response object
    console.log('Complete response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data
    });

    // Handle specific error cases
    if (response.status === 401) {
      // Check if we have a valid token in localStorage
      const storedToken = localStorage.getItem('token');
      if (storedToken && storedToken.length > 10) {
        // If we have a token but still get 401, it might be a backend issue
        console.warn('Got 401 but token exists in localStorage. This might be a backend issue.');
        throw new Error('Temporary server issue. Please refresh the page.');
      }
      throw new Error('Unauthorized. Please login again.');
    }

    if (response.status === 403) {
      throw new Error('Forbidden. You don\'t have permission to access this resource.');
    }

    if (response.status === 404) {
      throw new Error('Resource not found.');
    }

    // If not successful, throw error with message
    if (!response.ok) {
      throw new Error(data?.error || data?.message || `API error: ${response.statusText}`);
    }

    // Return the parsed data or empty object if no data
    return data || {};
  } catch (error) {
    console.error('Error in handleResponse:', {
      error,
      message: error.message,
      name: error.name
    });
    throw error;
  }
};

// Public API requests (no auth required)
export const fetchPublic = async (endpoint, options = {}) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    };

    console.log('Making public request to:', `${API_BASE_URL}${endpoint}`);
    console.log('Request config:', config);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return handleResponse(response);
  } catch (error) {
    console.error('Public API request failed:', error);
    throw error;
  }
};

export const fetchWithAuth = async (endpoint, options = {}) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Debug logging
    console.log('Token from fetchWithAuth:', token);
    console.log('Token type:', typeof token);
    console.log('Token length:', token?.length);
    
    if (!token) {
      // Instead of throwing an error immediately, try to get a new token
      // This will trigger a login page redirect if needed
      return fetchPublic('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          return response;
        }
        throw new Error('No token found. Please login again.');
      });
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
    
    // If we got a 401 but have a token, try to refresh it
    if (response.status === 401 && localStorage.getItem('token')) {
      try {
        const refreshResponse = await fetchPublic('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (refreshResponse.token) {
          localStorage.setItem('token', refreshResponse.token);
          // Retry the original request with the new token
          return fetchWithAuth(endpoint, options);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear storage if refresh fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
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

export default { fetchWithAuth, fetchPublic };
