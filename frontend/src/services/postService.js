import sendRequest from "./sendRequest";

const BASE_URL = '/api/posts';

export async function index() {
  return sendRequest(BASE_URL);
}

export async function create(postData) {
  return sendRequest(BASE_URL, 'POST', postData);
}

export async function deletePost(id) {
  return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

export async function likePost(postId) {
  return sendRequest(`${BASE_URL}/${postId}/like`, 'POST');
}