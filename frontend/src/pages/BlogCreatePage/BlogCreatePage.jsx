import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as blogService from '../../services/blogService';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';

const CATEGORIES = [
  'Music News',
  'Artist Spotlight',
  'Industry Trends',
  'Reviews',
  'Tutorials'
];

export default function BlogCreatePage() {
  const navigate = useNavigate();
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
  const [saveStatus, setSaveStatus] = useState('');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem('blogDraft');
    if (savedDraft) {
      try {
        setFormData(JSON.parse(savedDraft));
      } catch (err) {
        console.error('Error loading draft:', err);
        localStorage.removeItem('blogDraft');
      }
    }
  }, []);

  useEffect(() => {
    let autosaveInterval;
    if (autoSaveEnabled && !isSubmitting) {
      autosaveInterval = setInterval(() => {
        localStorage.setItem('blogDraft', JSON.stringify(formData));
        setSaveStatus('Draft saved automatically');
        setTimeout(() => setSaveStatus(''), 2000);
      }, 30000);
    }
    return () => clearInterval(autosaveInterval);
  }, [formData, autoSaveEnabled, isSubmitting]);

  const handleChange = (evt) => {
    const { name, value, files } = evt.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files ? files[0] : value
    }));
  };

  const handleContentChange = (newContent) => {
    setFormData(prevState => ({
      ...prevState,
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

  const handleSaveDraft = async () => {
    try {
      setError('');
      setIsSubmitting(true);
      
      const blogData = {
        ...formData,
        status: 'draft',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      await blogService.createBlog(blogData);
      setSaveStatus('Draft saved successfully');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setError(err.message || 'Failed to save draft');
      console.error('Error saving draft:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    try {
      setError('');
      if (!validateForm()) return;
  
      setIsSubmitting(true);
  
      const blogData = {
        ...formData,
        status: 'published',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        image: formData.image
      };
  
      await blogService.createBlog(blogData);
      localStorage.removeItem('blogDraft');
      navigate('/blog');
    } catch (err) {
      console.error('Failed to publish blog post:', err);
      setError(err.message || 'Failed to publish blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#98e4d3] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#d4e7aa]/70 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Create Blog Post</h1>
            {saveStatus && (
              <div className="text-sm text-green-600 bg-green-50/80 px-3 py-1 rounded">
                {saveStatus}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100/80 text-red-700 rounded-lg">
              {error}
            </div>
          )}

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
                  className="w-full p-3 bg-white/60 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#98e4d3] focus:border-transparent"
                  required
                  placeholder="Enter your blog post title"
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
                  className="w-full p-3 bg-white/60 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#98e4d3] focus:border-transparent"
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
                  placeholder="e.g., rock, album review, new release"
                  className="w-full p-3 bg-white/60 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#98e4d3] focus:border-transparent"
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
                  className="w-full p-3 bg-white/60 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#98e4d3] focus:border-transparent"
                  required
                  placeholder="Write a brief summary of your blog post"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autosave"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className="rounded text-[#98e4d3] focus:ring-[#98e4d3]"
                  disabled={isSubmitting}
                />
                <label htmlFor="autosave" className="text-sm text-gray-600">
                  Enable autosave
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <label className="block text-gray-700 font-medium mb-2">
                Content *
              </label>
              <div className="bg-white/60 rounded-lg">
                <RichTextEditor 
                  content={formData.content}
                  onChange={handleContentChange}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Featured Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full p-3 bg-white/60 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#98e4d3] focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="px-6 py-2 bg-white/60 border border-gray-200 rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-2 bg-white/60 border border-[#98e4d3] text-[#2c7566] rounded-lg hover:bg-[#98e4d3]/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="px-6 py-2 bg-[#98e4d3] text-white rounded-lg hover:bg-[#7fcebe]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}