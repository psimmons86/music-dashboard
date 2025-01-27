import sendRequest from './sendRequest';

const BASE_URL = '/api/user';

export function getFavorites() {
  return sendRequest(`${BASE_URL}/favorites`);
}

export function setFavorites(favorites) {
  return sendRequest(`${BASE_URL}/favorites`, 'POST', favorites);
}