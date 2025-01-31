import { getToken } from './authService';

const BASE_URL = '/api/posts';

export async function create(postData) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken()
    },
    body: JSON.stringify(postData)
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to create post');
  }
}

export async function index() {
  const res = await fetch(BASE_URL, {
    headers: {
      'Authorization': getToken()
    }
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to fetch posts');
  }
}

export async function deletePost(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': getToken()
    }
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to delete post');
  }
}

export async function likePost(id) {
  const res = await fetch(`${BASE_URL}/${id}/like`, {
    method: 'POST',
    headers: {
      'Authorization': getToken()
    }
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to like post');
  }
}