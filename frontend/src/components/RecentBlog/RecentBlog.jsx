import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import * as blogService from '../../services/blogService';
import { tagColors } from '../../constants';

export default function RecentBlog() {
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRecentBlog() {
      try {
        setIsLoading(true);
        const blogs = await blogService.getAllBlogs();
        if (blogs && blogs.length > 0) {
          setBlog(blogs[0]); // Get most recent blog
        }
      } catch (error) {
        console.error('Error fetching recent blog:', error);
        setError('Failed to load recent blog');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentBlog();
  }, []);

  return (
    <Card className="w-full bg-white/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">Latest from Daily Dispatch</h3>
        </div>
        <Link 
          to="/blog" 
          className="text-sm text-emerald-600 hover:underline"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm p-4">{error}</div>
        ) : blog ? (
          <Link to={`/blog/${blog._id}`}>
            <div className="space-y-4">
              {blog.image && (
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${tagColors[blog.category] || 'bg-gray-100'}`}>
                    {blog.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-semibold text-lg text-gray-800 line-clamp-2">
                  {blog.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {blog.summary}
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="text-center text-gray-500 p-4">
            No blog posts available
          </div>
        )}
      </CardContent>
    </Card>
  );
}