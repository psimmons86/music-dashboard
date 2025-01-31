import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import * as blogService from '../../services/blogService';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';

const CATEGORIES = [
  'Music News',
  'Artist Spotlight',
  'General',
  'Reviews',
  'Tutorials'
];

export default function BlogCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Music News',
    tags: '',
    summary: '',
    status: 'draft',
    imageUrl: ''
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
        localStorage.removeItem('blogDraft');
      }
    }
  }, []);

  useEffect(() => {
    let autoSaveTimer;
    let statusTimer;

    if (autoSaveEnabled && !isSubmitting) {
      autoSaveTimer = setTimeout(() => {
        localStorage.setItem('blogDraft', JSON.stringify(formData));
        setSaveStatus('Draft auto-saved');
        
        statusTimer = setTimeout(() => {
          setSaveStatus('');
        }, 2000);
      }, 30000);
    }

    return () => {
      clearTimeout(autoSaveTimer);
      clearTimeout(statusTimer);
    };
  }, [formData, autoSaveEnabled, isSubmitting]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleContentChange = (newContent) => {
    setFormData(prevState => ({
      ...prevState,
      content: newContent
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setIsSubmitting(true);
      
      const requiredFields = {
        title: 'Title is required',
        content: 'Content is required',
        summary: 'Summary is required',
        category: 'Category is required'
      };

      for (const [field, message] of Object.entries(requiredFields)) {
        if (!formData[field]?.trim()) {
          setError(message);
          return;
        }
      }

      if (formData.content.length < 100) {
        setError('Content must be at least 100 characters long');
        return;
      }

      if (formData.summary.length > 200) {
        setError('Summary must not exceed 200 characters');
        return;
      }

      const blogData = {
        ...formData,
        status: 'published',
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean),
        imageUrl: formData.imageUrl?.trim() || ''
      };

      await blogService.createBlog(blogData);
      localStorage.removeItem('blogDraft');
      setSaveStatus('Blog post published successfully!');

      setTimeout(() => {
        navigate('/blog');
      }, 1500);

    } catch (err) {
      if (err.status === 413) {
        setError('Image file size is too large. Please use a smaller image.');
      } else if (err.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login', { state: { from: location.pathname } });
      } else {
        setError(err.message || 'Failed to publish blog post. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setError('');
      setIsSubmitting(true);
      
      const draftData = {
        ...formData,
        status: 'draft',
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean),
        imageUrl: formData.imageUrl?.trim() || ''
      };

      await blogService.createBlog(draftData);
      localStorage.setItem('blogDraft', JSON.stringify(draftData));
      setSaveStatus('Draft saved successfully');

      setTimeout(() => {
        setSaveStatus('');
      }, 3000);

    } catch (err) {
      setError(err.message || 'Failed to save draft');
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
                    placeholder="e.g., rock, album review, new release"
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
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autosave"
                    checked={autoSaveEnabled}
                    onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                    className="rounded text-[#98e4d3]"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="autosave" className="text-sm text-gray-600">
                    Enable autosave
                  </label>
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
                    Featured Image URL
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full p-3 bg-white/60 border border-gray-200 rounded-lg"
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
                type="submit"
                className="px-6 py-2 bg-[#98e4d3] text-white rounded-lg hover:bg-[#7fcebe] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}