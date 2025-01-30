import sendRequest from './sendRequest';

const BASE_URL = '/api/user';

export function getProfile() {
  return sendRequest(`${BASE_URL}/profile`);
}

export function updateProfile(profileData) {
  return sendRequest(`${BASE_URL}/profile`, 'POST', profileData);
}

export function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append('profilePicture', file);

  return sendRequest(`${BASE_URL}/profile-picture`, 'POST', formData);
}

export function getFavorites() {
  return sendRequest(`${BASE_URL}/favorites`);
}

export function setFavorites(favorites) {
  return sendRequest(`${BASE_URL}/favorites`, 'POST', favorites);
}