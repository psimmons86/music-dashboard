import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router';
import * as blogService from '../../services/blogService';

export default function BlogDetailPage() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const data = await blogService.getBlog(id);
        setBlog(data);
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
      <div className="min-h-screen bg-[#98e4d3] p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6c0957]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#98e4d3] p-6">
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
      <div className="min-h-screen bg-[#98e4d3] p-6">
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
    <div className="min-h-screen bg-[#98e4d3] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/60 rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="px-3 py-1 bg-[#d4e7aa] text-sm rounded-full">
                  {blog.category}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {blog.title}
              </h1>
              {blog.author && (
                <p className="text-gray-600">
                  Written by {blog.author.name}
                </p>
              )}
            </div>
            
            {blog.author && blog.author._id === blog.user?._id && (
              <div className="flex gap-2">
                <Link
                  to={`/blog/${id}/edit`}
                  className="px-4 py-2 bg-[#d4e7aa] text-gray-800 rounded-lg hover:bg-[#c3d69b] transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  {confirmDelete ? 'Confirm Delete' : 'Delete'}
                </button>
              </div>
            )}
          </div>

          {blog.summary && (
            <div className="mb-8 text-lg text-gray-600 italic">
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
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {blog.viewCount > 0 && (
            <div className="mt-4 text-gray-500 text-sm">
              👁 {blog.viewCount} views
            </div>
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