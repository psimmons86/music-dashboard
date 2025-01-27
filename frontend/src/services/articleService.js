import sendRequest from './sendRequest';

const BASE_URL = '/api/articles';

export function saveArticle(articleData) {
  return sendRequest(`${BASE_URL}/save`, 'POST', articleData);
}

export function getSavedArticles() {
  return sendRequest(`${BASE_URL}/saved`);
}

export function deleteSavedArticle(articleId) {
  return sendRequest(`${BASE_URL}/saved/${articleId}`, 'DELETE');
}