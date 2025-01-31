import sendRequest from './sendRequest';

const BASE_URL = '/api/auth';

export function getToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  // Optional: add token expiration check
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
    return token;
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
}

export function getUser() {
  const token = getToken();
  return token ? JSON.parse(atob(token.split('.')[1])).user : null;
}

export async function signUp(userData) {
  try {
    const response = await sendRequest(`${BASE_URL}/signup`, 'POST', userData);
    
    if (!response || !response.token || !response.user) {
      throw new Error('Invalid signup response');
    }
    
    localStorage.setItem('token', response.token);
    return response.user;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function logIn(credentials) {
  try {
    const response = await sendRequest(`${BASE_URL}/login`, 'POST', credentials);
    
    if (!response || !response.token || !response.user) {
      throw new Error('Invalid login response');
    }
    
    localStorage.setItem('token', response.token);
    return response.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export function logOut() {
  localStorage.removeItem('token');
}

export async function updateUserRole(userId, role, secretKey) {
  return sendRequest(`${BASE_URL}/update-role`, 'POST', {
    userId,
    role,
    secretKey
  });
}