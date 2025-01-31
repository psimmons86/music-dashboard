import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { FileText, Crown, Loader2 } from 'lucide-react';
import * as blogService from '../../services/blogService';
import { tagColors } from '../../constants';

export default function BlogFeed() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setIsLoading(true);
        const data = await blogService.getAllBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    if (filter === 'all') return true;
    if (filter === 'official') return blog.isAdmin;
    if (filter === 'community') return !blog.isAdmin;
    return true;
  });

  return (
    <Card className="w-full bg-white/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">Blog Posts</h3>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm bg-white/60 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Posts</option>
            <option value="official">Official</option>
            <option value="community">Community</option>
          </select>
          <Link 
            to="/blog" 
            className="text-sm text-emerald-600 hover:underline"
          >
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm p-4">{error}</div>
        ) : filteredBlogs.length > 0 ? (
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <Link 
                key={blog._id}
                to={`/blog/${blog._id}`}
                className="block bg-white/60 rounded-lg p-4 hover:bg-white/80 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${tagColors[blog.category] || 'bg-gray-100'}`}>
                      {blog.category}
                    </span>
                    {blog.isAdmin && (
                      <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        <Crown className="h-3 w-3" />
                        Official
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-gray-800">{blog.title}</h4>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {blog.summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span>{blog.author?.name || 'Unknown Author'}</span>
                      <span>•</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    {blog.viewCount > 0 && (
                      <span>{blog.viewCount} view{blog.viewCount !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                  
                  {blog.image && (
                    <div className="mt-2 aspect-video w-full overflow-hidden rounded-lg">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 p-4">
            No blog posts found
          </div>
        )}
      </CardContent>
    </Card>
  );
}