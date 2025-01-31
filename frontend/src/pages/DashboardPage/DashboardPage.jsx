import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Users, Music, FileText, Crown, Newspaper } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './DashboardPage.css';

// Services
import * as postService from '../../services/postService';
import * as spotifyService from '../../services/spotifyService';

// Components 
import PostForm from '../../components/PostForm/PostForm';
import PostItem from '../../components/PostItem/PostItem';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import WeeklyPlaylist from '../../components/WeeklyPlaylist/WeeklyPlaylist';
import BlogFeed from '../../components/BlogFeed/BlogFeed';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function DashboardPage({ spotifyStatus, onSpotifyUpdate }) {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [layouts, setLayouts] = useState(
    localStorage.getItem('dashboardLayouts')
      ? JSON.parse(localStorage.getItem('dashboardLayouts'))
      : {
          lg: [
            { i: 'social', x: 0, y: 0, w: 12, h: 12 }, 
            { i: 'music', x: 0, y: 12, w: 6, h: 12 },
            { i: 'playlist', x: 6, y: 12, w: 6, h: 8 },
            { i: 'news', x: 6, y: 20, w: 6, h: 12 }, 
            { i: 'blogs', x: 0, y: 24, w: 12, h: 8 }
          ]
        }  
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError('');

        const postsData = await postService.index();
        setPosts(postsData);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load some content');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
 
  const handleCreatePost = async (postData) => {
    try {
      const newPost = await postService.create(postData);
      setPosts([newPost, ...posts]);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    }
  };
  
  const handleDeletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      setPosts(current => current.filter(post => post._id !== postId));  
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');  
    }
  };

  const handleLayoutChange = (layout, layouts) => {
    setLayouts(layouts);
    localStorage.setItem('dashboardLayouts', JSON.stringify(layouts));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-sans text-3xl font-bold text-emerald-900">
            Dashboard
          </h1>
          {isAdmin && (
            <Link 
              to="/blog/create"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Write Blog Post
            </Link>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="dashboard-grid">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            onLayoutChange={handleLayoutChange}
            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
            cols={{lg: 12, md: 12, sm: 6, xs: 4, xxs: 2}}
            rowHeight={30}
            autoSize={true}
            isDraggable
            isResizable
            margin={[16, 16]}
          >
            {/* Social Feed Section */}
            <div key="social" className="dashboard-item social-feed">
              <div className="p-6 h-full flex flex-col">
                <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Users size={20} />
                  Social Feed
                </h2>
                <PostForm onSubmit={handleCreatePost} />
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto pr-2 space-y-4">
                    {posts.map((post) => (
                      <PostItem
                        key={post._id}
                        post={post} 
                        onDelete={handleDeletePost}
                      />
                    ))}  
                  </div>
                </div>
              </div>
            </div>

            {/* Music Player Section */}
            <div key="music" className="dashboard-item music-player">
              <div className="p-6 h-full flex flex-col">
                <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Music size={20} /> 
                  Music Player
                </h2>
                <div className="flex-1 overflow-y-auto">
                  {spotifyStatus.connected ? (
                    <PlaylistCard
                      title="Create Daily Mix"
                      onPlaylistCreated={(playlist) => console.log('Playlist created:', playlist)}
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-6">
                        Connect Spotify to access your music
                      </p>
                      <SpotifyConnect onSuccess={onSpotifyUpdate} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Weekly Playlist Section */}
            <div key="playlist" className="dashboard-item weekly-playlist">
              <div className="p-6 h-full flex flex-col">
                <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Crown size={20} />
                  Weekly Playlist
                </h2>
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto pr-2">
                    <WeeklyPlaylist />
                  </div>
                </div>
              </div>
            </div>

            {/* News Section */}  
            <div key="news" className="dashboard-item music-news">
              <div className="p-6 h-full flex flex-col">
                <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Newspaper size={20} />
                  Music News
                </h2>
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto pr-2">
                    <NewsFeed />
                  </div>  
                </div>
              </div>
            </div>
            
            {/* Blog Feed Section */}
            <div key="blogs" className="dashboard-item blog-feed">
              <div className="p-6 h-full flex flex-col">
                <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FileText size={20} />
                  Daily Dispatch 
                </h2>
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto pr-2">
                    <BlogFeed />
                  </div>
                </div>
              </div>
            </div>
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  );
}