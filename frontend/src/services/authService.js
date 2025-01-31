import sendRequest from './sendRequest';

const BASE_URL = '/api/auth';

export function getToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now() + 300000) {
      return refreshToken();
    }
    return token;
  } catch (err) {
    console.error('Error parsing token:', err);
    localStorage.removeItem('token');
    return null;
  }
}

async function refreshToken() {
  try {
    const response = await sendRequest(`${BASE_URL}/refresh`, 'POST');
    if (response.token) {
      localStorage.setItem('token', response.token);
      return response.token;
    }
    throw new Error('No token in refresh response');
  } catch (err) {
    console.error('Token refresh failed:', err);
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
  
  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user)); // Make sure this line exists
  }
  
  return response.user;
}

export function logOut(redirectUrl = '/login') {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    sendRequest(`${BASE_URL}/logout`, 'POST').catch(console.error);
    
    const returnUrl = encodeURIComponent(redirectUrl);
    window.location.replace(`/login?returnUrl=${returnUrl}`);
  } catch (err) {
    console.error('Logout error:', err);
    window.location.replace('/login');
  }
}

export async function signUp(userData) {
  try {
    const response = await sendRequest(`${BASE_URL}/signup`, 'POST', userData);
    
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response.user;
  } catch (err) {
    console.error('Signup error:', err);
    throw new Error(err.message || 'Signup failed');
  }
}

export function checkAuthStatus() {
  const token = getToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function handleAuthError(error) {
  if (error.status === 401) {
    const currentPath = window.location.pathname;
    logOut(currentPath);
    return true;
  }
  return false;
}