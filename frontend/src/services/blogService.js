import sendRequest from './sendRequest';

const BASE_URL = '/api/blog';

export function getAllBlogs() {
  return sendRequest(BASE_URL);
}

export function getBlog(id) {
  return sendRequest(`${BASE_URL}/${id}`);
}

export function createBlog(blogData) {
  return sendRequest(BASE_URL, 'POST', blogData);
}

export function updateBlog(id, blogData) {
  return sendRequest(`${BASE_URL}/${id}`, 'PUT', blogData);
}

export function deleteBlog(id) {
  return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

export function getUserBlogs() {
  return sendRequest(`${BASE_URL}/user/posts`);
}