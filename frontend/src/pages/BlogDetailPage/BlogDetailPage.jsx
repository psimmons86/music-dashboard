import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import * as blogService from '../../services/blogService';
import { tagColors } from '../../constants';

export default function BlogDetailPage() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  console.log(typeof userString);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const data = await blogService.getBlog(id);
        setBlog(data);
        setEditedBlog(data);
        setError('');
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await blogService.updateBlog(id, editedBlog);
      setIsEditing(false);
      setBlog(editedBlog);
    } catch (err) {
      console.error('Error updating blog:', err);
      setError('Failed to update blog post');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedBlog(blog);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      await blogService.deleteBlog(id);
      navigate('/blog');
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError('Failed to delete blog post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6c0957]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <Link 
            to="/blog"
            className="text-[#6c0957] hover:underline mt-4 inline-block"
          >
            Back to Blog List
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
          <Link 
            to="/blog"
            className="text-[#6c0957] hover:underline"
          >
            Back to Blog List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {isEditing ? (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <input
                    type="text"
                    value={editedBlog.title}
                    onChange={(e) => setEditedBlog({ ...editedBlog, title: e.target.value })}
                    className="text-3xl font-bold text-[#6c0957] mb-2 w-full"
                  />
                  <div className="flex items-center gap-4 mb-2">
                    <select
                      value={editedBlog.category}
                      onChange={(e) => setEditedBlog({ ...editedBlog, category: e.target.value })}
                      className={`
                        inline-block px-3 py-1 rounded-full text-sm
                        ${tagColors[editedBlog.category] || 'bg-gray-100 text-[#4a5568]'}
                      `}
                    >
                      <option value="Music News">Music News</option>
                      <option value="Artist Spotlight">Artist Spotlight</option>
                      <option value="Industry Trends">Industry Trends</option>
                      <option value="Reviews">Reviews</option>
                      <option value="Tutorials">Tutorials</option>
                    </select>
                    <span className="text-[#718096] text-sm">
                      {new Date(editedBlog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {editedBlog.author && (
                    <p className="text-[#4a5568]">
                      Written by {editedBlog.author.name}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-[#d4e7aa] text-[#6c0957] rounded-lg hover:bg-[#c3d69b] transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-[#4a5568] rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <textarea
                value={editedBlog.content}
                onChange={(e) => setEditedBlog({ ...editedBlog, content: e.target.value })}
                className="w-full min-h-[400px] resize-none text-[#4a5568] focus:outline-none"
              ></textarea>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${tagColors[blog.category] || 'bg-gray-100'}`}>
                      {blog.category}
                    </span>
                    <span className="text-[#718096] text-sm">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-[#6c0957] mb-2">
                    {blog.title}
                  </h1>
                  {blog.author && (
                    <p className="text-[#4a5568]">
                      Written by {blog.author.name}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-[#d4e7aa] text-[#6c0957] rounded-lg hover:bg-[#c3d69b] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    {confirmDelete ? 'Confirm Delete' : 'Delete'}
                  </button>
                </div>
              </div>

              {blog.summary && (
                <div className="mb-8 text-lg text-[#4a5568] italic">
                  {blog.summary}
                </div>
              )}

              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map(tag => (
                      <span 
                        key={tag}
                        className={`
                          px-3 py-1 rounded-full text-sm
                          ${tagColors[tag] || 'bg-gray-100 text-[#4a5568]'}
                        `}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {blog.viewCount > 0 && (
                <div className="mt-4 text-[#718096] text-sm">
                  👁 {blog.viewCount} views
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-6">
          <Link 
            to="/blog"
            className="text-[#6c0957] hover:underline"
          >
            ← Back to Blog List
          </Link>
        </div>
      </div>
    </div>
  );
}