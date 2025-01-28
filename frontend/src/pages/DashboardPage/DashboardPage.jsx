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
        <div className="dashboard-box">
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

       
        <div className="dashboard-box">
          <h2>Music News</h2>
          <div className="scrollable-content">
            <NewsFeed />
          </div>
        </div>

        <div className="dashboard-box">
          <h2>Social Feed & Blog</h2>
          <div className="scrollable-content">
    
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
  );
}