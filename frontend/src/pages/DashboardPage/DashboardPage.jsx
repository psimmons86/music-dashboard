import { useState, useEffect } from 'react';
import * as postService from '../../services/postService';
import * as spotifyService from '../../services/spotifyService';
import * as articleService from '../../services/articleService';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import PlaylistGenerator from '../../components/PlaylistGenerator/PlaylistGenerator';
import PostItem from '../../components/PostItem/PostItem';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import './DashboardPage.css';

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [savedArticles, setSavedArticles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const spotifyStatus = await spotifyService.getSpotifyStatus();
        console.log('Spotify connection status:', spotifyStatus);
        setSpotifyConnected(spotifyStatus.connected);

        const [postsData, articlesData] = await Promise.all([
          postService.index(),
          articleService.getSavedArticles(),
        ]);
        setPosts(postsData);
        setSavedArticles(articlesData);
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

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-grid">
        <div className="dashboard-box">
          <h2>Music News</h2>
          <div className="scrollable-content">
            <NewsFeed />
          </div>
        </div>

        <div className="dashboard-box">
          <h2>Social Feed</h2>
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
            <div className="posts-container">
              {posts.map((post) => (
                <div key={post._id} className="post-item">
                  <PostItem post={post} />
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

        <div className="dashboard-box">
          <h2>Saved Articles</h2>
          <div className="scrollable-content">
            {savedArticles.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No saved articles yet</p>
            ) : (
              <div className="saved-articles">
                {savedArticles.map((article) => (
                  <article key={article._id} className="saved-article">
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <div className="article-actions">
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      <div>
                        <button onClick={() => handleDeleteArticle(article._id)}>Delete</button>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">Read</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}