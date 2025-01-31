import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import * as blogService from '../../services/blogService';
import { tagColors } from '../../constants';

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
        setLoading(true);
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

  const sortedBlogs = filteredBlogs.sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const featuredArticle = sortedBlogs[0];
  const additionalArticles = sortedBlogs.slice(1);

  return (
    <div className="min-h-screen bg-[#98e4d3]/10 p-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-900">Dashboard Dispatch</h1>
          <Link
            to="/blog/create"
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Write New Post
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors
                ${selectedCategory === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/60 text-emerald-800 hover:bg-emerald-50'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            {featuredArticle && (
              <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video overflow-hidden">
                    {featuredArticle.imageUrl ? (
                      <img
                        src={featuredArticle.imageUrl}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm mb-2 ${tagColors[featuredArticle.category] || 'bg-gray-100'}`}>
                      {featuredArticle.category}
                    </span>
                    <Link to={`/blog/${featuredArticle._id}`} className="block">
                      <h2 className="text-3xl font-bold text-emerald-900 mb-4 hover:text-emerald-700">
                        {featuredArticle.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {featuredArticle.summary}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{new Date(featuredArticle.createdAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{featuredArticle.author?.name || 'Anonymous'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {additionalArticles.map(blog => (
                <Link
                  key={blog._id}
                  to={`/blog/${blog._id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video overflow-hidden">
                    {blog.imageUrl ? (
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs mb-2 ${tagColors[blog.category] || 'bg-gray-100'}`}>
                      {blog.category}
                    </span>
                    <h3 className="font-bold text-lg text-emerald-800 mb-2 line-clamp-2 hover:text-emerald-600">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {blog.summary}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{blog.author?.name || 'Anonymous'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredBlogs.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-xl">No articles found in this category.</p>
                <Link
                  to="/blog/create"
                  className="mt-4 inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
                >
                  Be the First to Write
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}