import sendRequest from './sendRequest';

const BASE_URL = '/api/spotify';

export async function connectSpotify() {
  try {
    console.log('Initiating Spotify connection...');
    const response = await sendRequest(`${BASE_URL}/connect`);
    console.log('Spotify connect response:', response);
    
    if (!response?.url) {
      throw new Error('No authorization URL received from server');
    }
    return response;
  } catch (error) {
    console.error('Error connecting to Spotify:', error);
    throw error;
  }
}

export async function handleSpotifyCallback(code, state) {
  try {
    console.log('Handling Spotify callback:', { code, state });
    
    if (!code) {
      throw new Error('No authorization code provided');
    }

    const response = await sendRequest(`${BASE_URL}/callback`, 'POST', { 
      code,
      state
    });

    console.log('Spotify callback response:', response);
    return response;
  } catch (error) {
    console.error('Error handling Spotify callback:', error);
    throw error;
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
    return await sendRequest(`${BASE_URL}/disconnect`, 'POST');
  } catch (error) {
    console.error('Error disconnecting from Spotify:', error);
    throw error;
  }
}