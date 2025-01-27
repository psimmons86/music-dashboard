import sendRequest from './sendRequest';

const BASE_URL = '/api/spotify';

export async function connectSpotify() {
  const response = await sendRequest(`${BASE_URL}/connect`);
  if (response.url) {
    window.location.href = response.url;
  }
}

export async function handleCallback(code) {
  return sendRequest(`${BASE_URL}/callback?code=${code}`);
}

export async function getSpotifyStatus() {
  try {
    return await sendRequest(`${BASE_URL}/status`);
  } catch (error) {
    console.error('Error checking Spotify status:', error);
    return { connected: false };
  }
}