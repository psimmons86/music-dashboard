import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as blogService from '../../services/blogService';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';

export default function BlogEditPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Music News',
    tags: '',
    summary: '',
    status: 'draft',
    image: null
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const blog = await blogService.getBlog(id);
        setFormData({
          title: blog.title,
          content: blog.content,
          category: blog.category,
          tags: blog.tags.join(', '),
          summary: blog.summary,
          status: blog.status
        });
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog post');
      }
    }
    fetchBlog();
  }, [id]);

  const handleChange = (evt) => {
    const { name, value, files } = evt.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleContentChange = (newContent) => {
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  const validateForm = () => {
    if (!formData.title?.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.content?.trim()) {
      setError('Content is required');
      return false;
    }
    if (!formData.summary?.trim()) {
      setError('Summary is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (!validateForm()) return;

      setIsSubmitting(true);
      
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      await blogService.updateBlog(id, blogData);
      navigate('/blog');
    } catch (err) {
      console.error('Failed to update blog post:', err);
      setError(err.message || 'Failed to update blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CATEGORIES = [
    'Music News',
    'Artist Spotlight',
    'Industry Trends',
    'Reviews',
    'Tutorials'
  ];

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#98e4d3] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#d4e7aa]/70 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Blog Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 bg-white/60 border border-gray-200 rounded-lg"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 bg-white/60 border border-gray-200 rounded-lg"
                    disabled={isSubmitting}
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full p-3 bg-white/60 border border-gray-200 rounded-lg"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Summary *
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-3 bg-white/60 border border-gray-200 rounded-lg"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Content *
                  </label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={handleContentChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    New Featured Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full p-3 bg-white/60 border border-gray-200 rounded-lg"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="px-6 py-2 bg-white/60 border border-gray-200 rounded-lg"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#98e4d3] text-white rounded-lg hover:bg-[#7fcebe]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}