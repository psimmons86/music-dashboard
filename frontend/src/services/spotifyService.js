import sendRequest from './sendRequest';

const BASE_URL = '/api/spotify';


export async function connectSpotify() {
  try {
    console.log('Initiating Spotify connection...');
    const response = await sendRequest(`${BASE_URL}/connect`);
    console.log('Spotify connect response:', response);

    if (!response?.url) {
      throw new Error('No authorization URL received');
    }

    return response;
  } catch (error) {
    console.error('Error connecting to Spotify:', error);
    throw new Error('Failed to connect to Spotify. Please try again.');
  }
}

export async function handleSpotifyCallback(code, state) {
  try {
    console.log('Handling Spotify callback...', { code, state });

    if (!code || !state) {
      throw new Error('Invalid authorization code or state');
    }

    const response = await sendRequest(`${BASE_URL}/callback`, 'POST', {
      code,
      state,
    });

    console.log('Spotify callback response:', response);
    return response;
  } catch (error) {
    console.error('Error handling Spotify callback:', error);
    throw new Error('Failed to authenticate with Spotify. Please try again.');
  }
}

export async function getSpotifyStatus() {
  try {
    console.log('Checking Spotify status...');
    const response = await sendRequest(`${BASE_URL}/status`);
    console.log('Spotify status response:', response);
    return response;
  } catch (error) {
    console.error('Error checking Spotify status:', error);
    return { connected: false };
  }
}


export async function disconnectSpotify() {
  try {
    console.log('Disconnecting from Spotify...');
    const response = await sendRequest(`${BASE_URL}/disconnect`, 'POST');
    console.log('Spotify disconnect response:', response);
    return response;
  } catch (error) {
    console.error('Error disconnecting from Spotify:', error);
    throw new Error('Failed to disconnect from Spotify. Please try again.');
  }
}
