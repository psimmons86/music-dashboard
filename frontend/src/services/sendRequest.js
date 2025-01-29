import { getToken } from './authService';

export default async function sendRequest(url, method = 'GET', payload = null) {
  try {
    const options = { method };
    
    if (payload) {
      if (payload instanceof FormData) {
        options.body = payload;
      } else {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(payload);
      }
    }

    const token = getToken();
    if (token) {
      options.headers = options.headers || {};
      options.headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, options);
    
    if (res.status === 204) {
      return null;
    }
    
    const json = await res.json().catch(e => {
      console.error('JSON parse error:', e);
      throw new Error('Invalid response format from server');
    });
    
    if (!res.ok) {
      const error = new Error(json.error || json.message || 'Request failed');
      error.status = res.status;
      error.details = json;
      throw error;
    }
    
    return json;
  } catch (error) {
    console.error('Request error:', error);
    if (error.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}