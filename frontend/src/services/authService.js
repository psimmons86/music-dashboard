import sendRequest from './sendRequest';

const BASE_URL = '/api/auth';

export function getToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    // Verify token isn't expired
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
    return token;
  } catch (err) {
    console.error('Error parsing token:', err);
    localStorage.removeItem('token');
    return null;
  }
}

export function getUser() {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user;
  } catch (err) {
    console.error('Error getting user from token:', err);
    return null;
  }
}

export async function logIn(credentials) {
  const response = await sendRequest(`${BASE_URL}/login`, 'POST', credentials);
  
  // Save token
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  
  return response.user;
}

export function logOut() {
  localStorage.removeItem('token');
  window.location.replace('/login');
}

export async function signUp(userData) {
  const response = await sendRequest(`${BASE_URL}/signup`, 'POST', userData);
  
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  
  return response.user;
}