import sendRequest from './sendRequest';

const BASE_URL = '/api/spotify';

export async function connectSpotify() {
  try {
    const response = await sendRequest(`${BASE_URL}/connect`);
    return response;
  } catch (error) {
    console.error('Error connecting to Spotify:', error);
    throw new Error('Failed to connect to Spotify');
  }
}

export async function getSpotifyStatus() {
  try {
    const response = await sendRequest(`${BASE_URL}/status`);
    return response;
  } catch (error) {
    console.error('Error checking Spotify status:', error);
    return { connected: false };
  }
}

export async function disconnectSpotify() {
  try {
    const response = await sendRequest(`${BASE_URL}/disconnect`, 'POST');
    return response;
  } catch (error) {
    console.error('Error disconnecting from Spotify:', error);
    throw new Error('Failed to disconnect from Spotify');
  }
}

export async function getTopArtists() {
  try {
    const response = await sendRequest(`${BASE_URL}/top-artists`);
    return response;
  } catch (error) {
    console.error('Error fetching top artists:', error);
    throw error;
  }
}

export async function getRecommendations(genre, mood) {
  try {
    const params = new URLSearchParams({
      genre: genre.toLowerCase(),
      mood: mood.toLowerCase()
    });
    
    const response = await sendRequest(`${BASE_URL}/recommendations?${params}`);
    if (!Array.isArray(response)) {
      throw new Error('Invalid recommendations response');
    }
    return response;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    if (error.status === 401) {
      throw new Error('Please reconnect your Spotify account');
    }
    throw new Error(error.message || 'Failed to get recommendations');
  }
}

export async function handleSpotifyCallback(code) {
  try {
    const response = await sendRequest(`${BASE_URL}/callback`, 'POST', { code });
    return response;
  } catch (error) {
    console.error('Error handling Spotify callback:', error);
    throw new Error('Failed to complete Spotify connection');
  }
}