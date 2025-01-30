import sendRequest from './sendRequest';

const BASE_URL = '/api/blog';

export function getAllBlogs() {
  return sendRequest(BASE_URL);
}

export function getBlog(id) {
  return sendRequest(`${BASE_URL}/${id}`);
}

export function getUserBlogs() {
  return sendRequest(`${BASE_URL}/user/posts`);
}

export function deleteBlog(id) {
  return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

export async function createBlog(blogData) {
  try {
    // Validate required fields upfront
    const requiredFields = ['title', 'content', 'category', 'summary'];
    const missingFields = requiredFields.filter(field => !blogData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Normalize tags
    blogData.tags = Array.isArray(blogData.tags) 
      ? blogData.tags.filter(tag => tag) 
      : blogData.tags
        ?.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag) 
      || [];

    // If image is present, use FormData
    if (blogData.image) {
      const formData = new FormData();
      Object.entries(blogData).forEach(([key, value]) => {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      return sendRequest(BASE_URL, 'POST', formData);
    }

    return sendRequest(BASE_URL, 'POST', blogData);
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
}

export async function updateBlog(id, blogData) {
  try {
    // Normalize tags (same as in createBlog)
    blogData.tags = Array.isArray(blogData.tags) 
      ? blogData.tags.filter(tag => tag)
      : blogData.tags
        ?.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)
      || [];

    if (blogData.image) {
      const formData = new FormData();
      Object.entries(blogData).forEach(([key, value]) => {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      return sendRequest(`${BASE_URL}/${id}`, 'PUT', formData);
    }

    return sendRequest(`${BASE_URL}/${id}`, 'PUT', blogData);
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
}

export async function uploadBlogImage(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    return sendRequest(`${BASE_URL}/upload-image`, 'POST', formData);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function saveDraft(blogData) {
  try {
    const draftData = {
      ...blogData,
      status: 'draft'
    };
    return await createBlog(draftData);
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
}

export async function publishBlog(blogData) {
  try {
    const publishData = {
      ...blogData,
      status: 'published'
    };
    
    if (blogData._id) {
      return await updateBlog(blogData._id, publishData);
    } else {
      return await createBlog(publishData);
    }
  } catch (error) {
    console.error('Error publishing blog:', error);
    throw error;
  }
}