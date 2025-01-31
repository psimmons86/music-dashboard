import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Users, Music, FileText, Disc, Crown, Newspaper } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './DashboardPage.css';

// Services
import * as postService from '../../services/postService';
import * as spotifyService from '../../services/spotifyService';
import * as blogService from '../../services/blogService';

// Components 
import PostForm from '../../components/PostForm/PostForm';
import PostItem from '../../components/PostItem/PostItem';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import WeeklyPlaylist from '../../components/WeeklyPlaylist/WeeklyPlaylist';
import BlogFeed from '../../components/BlogFeed/BlogFeed';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Helper Components
function TopArtistsSection({ artists }) {
  if (!artists?.length) return null;

  return (
    <div className="bg-white/50 rounded-xl p-4">
      <h3 className="font-medium text-gray-800 mb-3 text-sm flex items-center gap-2">
        <Users size={14} />
        Your Top Artists  
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {artists.slice(0, 4).map((artist) => (
          <div 
            key={artist.id}
            className="bg-white/50 p-2 rounded-lg flex items-center gap-2"
          >
            {artist.images?.[0]?.url && (
              <img 
                src={artist.images[0].url} 
                alt={artist.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-xs">{artist.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentAlbumsSection({ albums }) {
  if (!albums?.length) return null;
  
  return (
    <div className="bg-white/50 rounded-xl p-4">
      <h3 className="font-medium text-gray-800 mb-3 text-sm flex items-center gap-2">
        <Disc size={14} />
        Recent Albums
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {albums.slice(0, 4).map((album) => (
          <div key={album.id} className="bg-white/50 p-2 rounded-lg">
            {album.images?.[0]?.url && (
              <img 
                src={album.images[0].url}
                alt={album.name}
                className="w-full aspect-square object-cover rounded-md mb-1"
              />
            )}
            <p className="text-xs truncate">{album.name}</p>
            <p className="text-xs text-gray-500 truncate">
              {album.artists?.[0]?.name}  
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserPlaylistsSection({ playlists }) {
  if (!playlists?.length) return null;

  return (
    <div className="bg-white/50 rounded-xl p-4">
      <h3 className="font-medium text-gray-800 mb-3 text-sm flex items-center gap-2">
        <Music size={14} />
        Your Playlists
      </h3>
      <div className="space-y-2">
        {playlists.slice(0, 3).map((playlist) => (
          <div 
            key={playlist.id}
            className="bg-white/50 p-2 rounded-lg flex items-center gap-2"
          >
            {playlist.images?.[0]?.url ? (
              <img 
                src={playlist.images[0].url}
                alt={playlist.name}
                className="w-8 h-8 object-cover rounded"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            )}
            <div>
              <p className="text-xs font-medium">{playlist.name}</p>
              <p className="text-xs text-gray-500">
                {playlist.tracks?.total || 0} tracks
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage({ spotifyStatus, onSpotifyUpdate }) {
  const [posts, setPosts] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [layouts, setLayouts] = useState(
    localStorage.getItem('dashboardLayouts')
      ? JSON.parse(localStorage.getItem('dashboardLayouts'))
      : {
          lg: [
            { i: 'social', x: 0, y: 0, w: 12, h: 12 }, 
            { i: 'music', x: 0, y: 12, w: 6, h: 12 },
            { i: 'news', x: 6, y: 12, w: 6, h: 12 }, 
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
        
        if (spotifyStatus.connected) {
          const [artists, albums, playlists] = await Promise.all([
            spotifyService.getTopArtists(),
            spotifyService.getRecentAlbums(),
            spotifyService.getUserPlaylists()
          ]);
          
          setTopArtists(artists);
          setRecentAlbums(albums);
          setUserPlaylists(playlists);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load some content');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [spotifyStatus.connected]);
 
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
          <Link 
            to="/blog/create"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Write Blog Post  
          </Link>
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

            {/* Music Section */}
            <div key="music" className="dashboard-item music-player">
              <div className="p-6 h-full flex flex-col">
                <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Music size={20} /> 
                  Music Player
                </h2>
                <div className="flex-1 overflow-hidden">
                  {spotifyStatus.connected ? (
                    <div className="h-full overflow-y-auto pr-2 space-y-6">
                      <WeeklyPlaylist />
                      <TopArtistsSection artists={topArtists} />
                      <RecentAlbumsSection albums={recentAlbums} />
                      <UserPlaylistsSection playlists={userPlaylists} />
                    </div>
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