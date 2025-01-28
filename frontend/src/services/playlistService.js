import sendRequest from './sendRequest';

const BASE_URL = '/api/playlist';

export async function create(playlistData) {
  try {
    // Ensure the mood is lowercase for consistency
    const data = {
      ...playlistData,
      mood: playlistData.mood.toLowerCase()
    };
    
    const response = await sendRequest(BASE_URL, 'POST', data);
    if (!response) {
      throw new Error('No response from server');
    }
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response;
  } catch (error) {
    console.error('Playlist service error:', error);
    
    // Handle specific error types
    if (error.status === 401) {
      throw new Error('Please reconnect your Spotify account');
    } else if (error.status === 404) {
      throw new Error('Could not find the specified genre or mood');
    } else if (error.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    
    // If we have a specific error message from the server, use it
    if (error.message) {
      throw new Error(error.message);
    }
    
    throw new Error('Failed to create playlist. Please try again.');
  }
}