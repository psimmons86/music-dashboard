import sendRequest from './sendRequest';

const BASE_URL = '/api/playlist';

export async function create() {
  try {
    const response = await sendRequest(BASE_URL, 'POST');
    if (!response) {
      throw new Error('No response from server');
    }
    return response;
  } catch (error) {
    console.error('Playlist service error:', error);
    throw new Error(error.message || 'Failed to create playlist');
  }
}