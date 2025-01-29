import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import * as blogService from '../../services/blogService';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'All',
    'Music News',
    'Artist Spotlight',
    'Industry Trends',
    'Reviews',
    'Tutorials'
  ];

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await blogService.getAllBlogs();
        setBlogs(data);
        setError('');
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    selectedCategory.toLowerCase() === 'all' || blog.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-[#98e4d3] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
          <Link 
            to="/blog/create"
            className="bg-[#d4e7aa] text-gray-800 px-6 py-2 rounded-lg hover:bg-[#c3d69b] transition-colors"
          >
            Write New Post
          </Link>
        </div>

        <div className="mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#98e4d3]"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6c0957]"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map(blog => (
              <Link 
                key={blog._id} 
                to={`/blog/${blog._id}`}
                className="bg-white/60 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-[#d4e7aa] text-sm rounded-full">
                    {blog.category}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.summary}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{blog.status === 'published' ? '📢 Published' : '📝 Draft'}</span>
                  {blog.viewCount > 0 && (
                    <span>• 👁 {blog.viewCount} views</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts found.</p>
            <Link 
              to="/blog/create"
              className="text-[#6c0957] hover:underline mt-2 inline-block"
            >
              Create your first post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}