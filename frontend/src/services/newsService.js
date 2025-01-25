import sendRequest from './sendRequest';

const BASE_URL = '/api/news';

export function getNews(genre = '') {
  return sendRequest(`${BASE_URL}?genre=${genre}`, 'GET');
}