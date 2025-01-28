import sendRequest from './sendRequest';

const BASE_URL = '/api/user';

export function getFavorites() {
  return sendRequest(`${BASE_URL}/favorites`);
}

export function setFavorites(favorites) {
  return sendRequest(`${BASE_URL}/favorites`, 'POST', favorites);
}

export function getProfile() {
  return sendRequest(`${BASE_URL}/profile`);
}

export function updateProfile(profileData) {
  return sendRequest(`${BASE_URL}/profile`, 'POST', profileData);
}

export function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append('profilePicture', file);

  return fetch(`${BASE_URL}/profile-picture`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then(response => {
    if (!response.ok) {
      throw new Error('Failed to upload profile picture');
    }
    return response.json();
  });
}