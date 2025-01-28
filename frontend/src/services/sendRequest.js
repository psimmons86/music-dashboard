import { getToken } from './authService';

export default async function sendRequest(url, method = 'GET', payload = null) {
  try {
    const options = { method };
    
    if (payload) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(payload);
    }

    const token = getToken();
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }

    const res = await fetch(url, options);
    
    // Only try to parse JSON if we have content
    if (res.status !== 204) {
      const data = await res.json().catch(e => {
        console.error('JSON parse error:', e);
        throw new Error('Invalid response format from server');
      });
      
      if (!res.ok) {
        const error = new Error(data.error || data.message || 'Request failed');
        error.status = res.status;
        error.details = data;
        throw error;
      }
      
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Request error:', error);
    if (error.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
    
    // Convert object errors to strings
    if (error instanceof Error) {
      throw error;
    } else if (typeof error === 'object') {
      throw new Error(JSON.stringify(error));
    } else {
      throw new Error(error);
    }
  }
}