import { useState, useEffect } from 'react';
import * as postService from '../../services/postService';
import * as spotifyService from '../../services/spotifyService';
import * as articleService from '../../services/articleService';
import * as blogService from '../../services/blogService';
import * as userService from '../../services/userService';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import PlaylistGenerator from '../../components/PlaylistGenerator/PlaylistGenerator';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import './DashboardPage.css';

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [savedArticles, setSavedArticles] = useState([]);
  const [error, setError] = useState('');
  const [showNewBlogForm, setShowNewBlogForm] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    summary: ''
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const spotifyStatus = await spotifyService.getSpotifyStatus();
        setSpotifyConnected(spotifyStatus.connected);

        const [postsData, articlesData, blogsData, profileData] = await Promise.all([
          postService.index(),
          articleService.getSavedArticles(),
          blogService.getAllBlogs(),
          userService.getProfile()
        ]);

        setPosts(postsData);
        setSavedArticles(articlesData);
        setBlogs(blogsData);
        setUserProfile(profileData);
        setError('');
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data. Please try again.');
      }
    }
    fetchData();
  }, []);

  async function handleSubmitPost(evt) {
    evt.preventDefault();
    try {
      const post = await postService.create(newPost);
      setPosts([post, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  }

  async function handleDeleteArticle(articleId) {
    try {
      await articleService.deleteSavedArticle(articleId);
      setSavedArticles((prevArticles) => prevArticles.filter((article) => article._id !== articleId));
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  }

  async function handleSubmitBlog(evt) {
    evt.preventDefault();
    try {
      const blogData = {
        ...blogFormData,
        tags: blogFormData.tags.split(',').map(tag => tag.trim())
      };
      const newBlog = await blogService.createBlog(blogData);
      setBlogs([newBlog, ...blogs]);
      setBlogFormData({
        title: '',
        content: '',
        category: '',
        tags: '',
        summary: ''
      });
      setShowNewBlogForm(false);
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-grid">
        {/* Profile Box */}
        <div className="profile-box">
          <h2>My Profile</h2>
          <div className="scrollable-content">
            {userProfile && (
              <div className="profile-preview">
                <div className="profile-preview-header">
                  <img
                    src={userProfile.profilePicture ? `/uploads/profilePictures/${userProfile.profilePicture}` : '/default-profile.png'}
                    alt="Profile"
                    className="profile-preview-image"
                    onError={(e) => {
                      e.target.src = '/default-profile.png';
                    }}
                  />
                  <h3>{userProfile.name}</h3>
                  {userProfile.location && (
                    <p className="profile-preview-location">
                      📍 {userProfile.location}
                    </p>
                  )}
                </div>

                {userProfile.bio && (
                  <div className="profile-preview-bio">
                    <p>{userProfile.bio}</p>
                  </div>
                )}

                {userProfile.socialLinks && (
                  <div className="profile-preview-social">
                    <h4>Social Links</h4>
                    <div className="social-links-grid">
                      {userProfile.socialLinks.discogs && (
                        <a 
                          href={userProfile.socialLinks.discogs} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-link"
                        >
                          Discogs
                        </a>
                      )}
                      {userProfile.socialLinks.vinylVault && (
                        <a 
                          href={userProfile.socialLinks.vinylVault} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-link"
                        >
                          Vinyl Vault
                        </a>
                      )}
                      {userProfile.socialLinks.lastFm && (
                        <a 
                          href={userProfile.socialLinks.lastFm} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-link"
                        >
                          Last.fm
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Boxes */}
        <div className="content-boxes">
          <div className="dashboard-box">
            <h2>Music News</h2>
            <div className="scrollable-content">
              <NewsFeed />
            </div>
          </div>

          <div className="dashboard-box">
            <h2>Social Feed & Blog</h2>
            <div className="scrollable-content">
              <form onSubmit={handleSubmitPost} className="post-form">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your music thoughts..."
                  required
                />
                <button type="submit">Post</button>
              </form>

              {/* Blog Section */}
              <div className="blog-section mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Blog Posts</h3>
                  <button
                    onClick={() => setShowNewBlogForm(!showNewBlogForm)}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    {showNewBlogForm ? 'Cancel' : 'Create Blog Post'}
                  </button>
                </div>

                {showNewBlogForm && (
                  <form onSubmit={handleSubmitBlog} className="blog-form mb-6">
                    <input
                      type="text"
                      value={blogFormData.title}
                      onChange={(e) => setBlogFormData({...blogFormData, title: e.target.value})}
                      placeholder="Blog Title"
                      className="w-full px-4 py-2 mb-2 border rounded"
                      required
                    />
                    <textarea
                      value={blogFormData.content}
                      onChange={(e) => setBlogFormData({...blogFormData, content: e.target.value})}
                      placeholder="Blog Content"
                      className="w-full px-4 py-2 mb-2 border rounded"
                      rows="4"
                      required
                    />
                    <input
                      type="text"
                      value={blogFormData.summary}
                      onChange={(e) => setBlogFormData({...blogFormData, summary: e.target.value})}
                      placeholder="Brief Summary"
                      className="w-full px-4 py-2 mb-2 border rounded"
                      required
                    />
                    <select
                      value={blogFormData.category}
                      onChange={(e) => setBlogFormData({...blogFormData, category: e.target.value})}
                      className="w-full px-4 py-2 mb-2 border rounded"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Music News">Music News</option>
                      <option value="Artist Spotlight">Artist Spotlight</option>
                      <option value="Industry Trends">Industry Trends</option>
                      <option value="Reviews">Reviews</option>
                      <option value="Tutorials">Tutorials</option>
                    </select>
                    <input
                      type="text"
                      value={blogFormData.tags}
                      onChange={(e) => setBlogFormData({...blogFormData, tags: e.target.value})}
                      placeholder="Tags (comma-separated)"
                      className="w-full px-4 py-2 mb-2 border rounded"
                    />
                    <button
                      type="submit"
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                      Create Blog Post
                    </button>
                  </form>
                )}

                <div className="blog-list space-y-4">
                  {blogs.map((blog) => (
                    <div key={blog._id} className="blog-item bg-white p-4 rounded shadow">
                      <h4 className="font-semibold">{blog.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{blog.summary}</p>
                      <div className="flex justify-between text-sm">
                        <span>{blog.category}</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="posts-container mt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
                {posts.map((post) => (
                  <div key={post._id} className="post-item">
                    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold">
                            {post.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{post.user.name}</h4>
                          <time className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </time>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{post.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-box">
            <h2>Music Player</h2>
            <div className="scrollable-content">
              {!spotifyConnected ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-6">Connect Spotify to create playlists</p>
                  <SpotifyConnect />
                </div>
              ) : (
                <PlaylistGenerator />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}