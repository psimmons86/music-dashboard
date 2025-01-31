import sendRequest from './sendRequest';

const BASE_URL = '/api/weekly-playlist';

export async function getCurrentPlaylist() {
  return sendRequest(`${BASE_URL}/current`);
}

export async function updateWeeklyPlaylist(playlistData) {
  try {
    return await sendRequest(`${BASE_URL}/update`, 'POST', playlistData);
  } catch (error) {
    console.error('Error updating weekly playlist:', error);
    throw error;
  }
}