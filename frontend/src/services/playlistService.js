import sendRequest from './sendRequest';

const BASE_URL = '/api/playlist';

export async function getCurrentPlaylist() {
  try {
    return await sendRequest(`${BASE_URL}/current`, 'GET');
  } catch (error) {
    console.error('Playlist service error:', error);
    throw error;
  }
}

export async function create() {
  try {
    return await sendRequest(BASE_URL, 'POST');
  } catch (error) {
    console.error('Playlist service error:', error);
    throw error;
  }
}

export async function getUserStats() {
  try {
    return await sendRequest(`${BASE_URL}/stats`, 'GET');
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    // Return empty stats on error
    return {
      topArtists: [],
      topAlbums: [],
      topGenres: []
    };
  }
}