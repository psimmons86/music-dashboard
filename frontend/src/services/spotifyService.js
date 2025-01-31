// spotifyService.js
import sendRequest from './sendRequest';

const BASE_URL = '/api/spotify';

export async function connectSpotify() {
  try {
    const response = await sendRequest(`${BASE_URL}/connect`);
    if (!response?.url) {
      throw new Error('No authorization URL received from server');
    }
    return response;
  } catch (error) {
    console.error('Error connecting to Spotify:', error);
    throw error;
  }
}

export async function handleSpotifyCallback(code) {
  try {
    return await sendRequest(`${BASE_URL}/callback`, 'POST', { code });
  } catch (error) {
    console.error('Error handling Spotify callback:', error);
    throw error;
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
    return await sendRequest(`${BASE_URL}/disconnect`, 'POST');
  } catch (error) {
    console.error('Error disconnecting from Spotify:', error);
    throw error;
  }
}

export async function getRecommendations(genre, mood) {
  try {
    if (!genre || !mood) {
      throw new Error('Missing genre or mood parameter');
    }

    const params = new URLSearchParams({
      genre: genre.toLowerCase(),
      mood: mood.toLowerCase()
    });

    const response = await sendRequest(`${BASE_URL}/recommendations?${params}`);
    
    if (!response) {
      throw new Error('No recommendations received');
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
}