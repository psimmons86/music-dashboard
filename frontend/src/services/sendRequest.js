import { getToken } from './authService';

export default async function sendRequest(url, method = 'GET', payload = null) {
  const options = { method };
  options.headers = {};
  
  // Add token if available
  const token = getToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  // Add content-type and body if needed
  if (payload) {
    if (payload instanceof FormData) {
      options.body = payload;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(payload);
    }
  }

  try {
    console.log(`Sending ${method} request to ${url}`);
    const res = await fetch(url, options);
    
    // Handle no content response
    if (res.status === 204) {
      return null;
    }

    let json;
    try {
      json = await res.json();
    } catch (e) {
      console.error('Error parsing JSON:', e);
      throw new Error('Invalid response format from server');
    }

    // Handle unsuccessful responses
    if (!res.ok) {
      console.error('Request failed:', json);
      const error = new Error(json.message || json.error || 'Request failed');
      error.status = res.status;
      throw error;
    }

    return json;
  } catch (err) {
    console.error('Request error:', err);

    // Handle authentication errors
    if (err.status === 401) {
      localStorage.removeItem('token');
      window.location.replace('/login');
      throw new Error('Authentication expired. Please log in again.');
    }

    throw err;
  }
}