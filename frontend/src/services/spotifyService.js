import sendRequest from './sendRequest';
import { getToken } from './authService';

const BASE_URL = '/api/spotify';

export async function connectSpotify() {
  try {
    console.log('Frontend: Initiating Spotify connection...');
    const token = getToken();
    if (!token) {
      console.error('Frontend: No auth token available');
      throw new Error('Authentication required');
    }

    const response = await sendRequest(`${BASE_URL}/connect`);
    console.log('Frontend: Spotify connect response:', response);

    if (!response?.url) {
      console.error('Frontend: No authorization URL received');
      throw new Error('No authorization URL received');
    }

    return response;
  } catch (error) {
    console.error('Frontend: Error connecting to Spotify:', error);
    throw new Error('Failed to connect to Spotify. Please try again.');
  }
}

export async function handleSpotifyCallback(code, state) {
  try {
    console.log('Frontend: Handling Spotify callback...', { code, state });

    if (!code || !state) {
      console.error('Frontend: Invalid callback parameters');
      throw new Error('Invalid authorization code or state');
    }

    const response = await sendRequest(`${BASE_URL}/callback`, 'POST', {
      code,
      state,
    });

    console.log('Frontend: Spotify callback response:', response);
    return response;
  } catch (error) {
    console.error('Frontend: Error handling Spotify callback:', error);
    throw new Error('Failed to authenticate with Spotify. Please try again.');
  }
}

export async function getSpotifyStatus() {
  try {
    console.log('Frontend: Checking Spotify status...');
    const token = getToken();
    if (!token) {
      console.log('Frontend: No auth token, returning disconnected status');
      return { connected: false };
    }

    const response = await sendRequest(`${BASE_URL}/status`);
    console.log('Frontend: Spotify status response:', response);
    return {
      connected: Boolean(response?.connected),
      userId: response?.userId
    };
  } catch (error) {
    console.error('Frontend: Spotify status check error:', error);
    if (error.status === 401) {
      console.log('Frontend: Unauthorized, returning disconnected status');
      return { connected: false };
    }
    throw error;
  }
}

export async function disconnectSpotify() {
  try {
    console.log('Frontend: Disconnecting from Spotify...');
    const response = await sendRequest(`${BASE_URL}/disconnect`, 'POST');
    console.log('Frontend: Spotify disconnect response:', response);
    return response;
  } catch (error) {
    console.error('Frontend: Error disconnecting from Spotify:', error);
    throw new Error('Failed to disconnect from Spotify. Please try again.');
  }
}