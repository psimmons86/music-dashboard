import sendRequest from './sendRequest';

const BASE_URL = '/api/spotify';

export async function connectSpotify() {
  const response = await sendRequest(`${BASE_URL}/connect`);
  window.location.href = response.url;
}

export async function getSpotifyStatus() {
  return sendRequest(`${BASE_URL}/status`);
}