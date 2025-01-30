import sendRequest from './sendRequest';

const BASE_URL = '/api/auth';



export async function signUp(userData) {
  const response = await sendRequest(`${BASE_URL}/signup`, 'POST', userData);
  localStorage.setItem('token', response.token);
  return response.user;
}

export async function logIn(credentials) {
  const response = await sendRequest(`${BASE_URL}/login`, 'POST', credentials);
  localStorage.setItem('token', response.token);
  return response.user;
}

export function logOut() {
  localStorage.removeItem('token');
}

export function getUser() {
  const token = getToken();
  return token ? JSON.parse(atob(token.split('.')[1])).user : null;
}

export function getToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));
  if (payload.exp * 1000 < Date.now()) {
    localStorage.removeItem('token');
    return null;
  }

  return token;
}

export async function updateUserRole(userId, role, secretKey) {
  return sendRequest(`${BASE_URL}/update-role`, 'POST', {
    userId,
    role,
    secretKey
  });
}

