import sendRequest from './sendRequest';

const BASE_URL = '/api/playlist';

export function create(playlistData) {
  return sendRequest(BASE_URL, 'POST', playlistData);
}