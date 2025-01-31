import { getToken } from './authService';

export default async function sendRequest(url, method = 'GET', payload = null) {
  try {
    const options = { method };
    
    if (payload) {
      options.headers = options.headers || {};
      
      if (payload instanceof FormData) {
        options.body = payload;
      } else {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(payload);
      }
    }

    const token = getToken();
    if (token) {
      options.headers = options.headers || {};
      options.headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, options);
    
    if (res.status === 503) {
      throw new Error('Service is currently unavailable. Please try again later.');
    }
    
    if (res.status === 204) return null;
    
    let json;
    try {
      json = await res.json();
    } catch (parseError) {
      throw new Error('Invalid response format from server');
    }
    
    if (!res.ok) {
      const error = new Error(
        json.message || 
        json.error || 
        'Request failed'
      );
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
    }
    
    throw error;
  }
}