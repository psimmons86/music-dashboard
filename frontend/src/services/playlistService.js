import sendRequest from './sendRequest';

const BASE_URL = '/api/playlist';

export async function create(playlistData) {
  try {
    return await sendRequest(BASE_URL, 'POST', playlistData);
  } catch (error) {
    console.error('Playlist service error:', error);
    throw error;
  }
}