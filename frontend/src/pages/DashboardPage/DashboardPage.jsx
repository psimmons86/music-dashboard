import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import * as postService from '../../services/postService';
import * as spotifyService from '../../services/spotifyService';
import * as articleService from '../../services/articleService';
import * as userService from '../../services/userService';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import SpotifyPlayer from '../../components/SpotifyPlayer/SpotifyPlayer';
import SpotifyConnect from '../../components/SpotifyConnect/SpotifyConnect';
import PostForm from '../../components/PostForm/PostForm';
import { Music, Disc, Users, Clock, LineChart } from 'lucide-react';

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [topArtists, setTopArtists] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const spotifyStatus = await spotifyService.getSpotifyStatus();
        setSpotifyConnected(spotifyStatus.connected);

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

        const [postsData, profileData] = await Promise.all([
          postService.index(),
          userService.getProfile()
        ]);

        setPosts(postsData);
        setUserProfile(profileData);
        setError('');
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data');
      }
    }
    fetchData();
  }, []);

  const handleCreatePost = async (postData) => {
    try {
      const newPost = await postService.create({
        content: postData.content,
        currentSong: postData.currentSong
      });
      setPosts([newPost, ...posts]);
    } catch (err) {
      setError('Failed to create post');
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-[#98e4d3] rounded-3xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-sans text-3xl font-bold text-emerald-900">Dashboard</h1>
          <Link 
            to="/blog/create"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Create Blog
          </Link>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Social Feed */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-[#d4e7aa]/70 rounded-2xl p-6 shadow-sm h-[65vh]">
              <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Users size={20} />
                Social Feed
              </h2>

              <PostForm onSubmit={handleCreatePost} />

              <div className="overflow-y-auto h-[calc(100%-180px)] pr-2">
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post._id} className="p-4 bg-white/60 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {post.user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 text-sm">{post.user.name}</h4>
                          <time className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </time>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {post.content}
                      </p>
                      {post.currentSong && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 bg-emerald-50 p-2 rounded-lg">
                          <Music size={14} />
                          <span>Now Playing: {post.currentSong}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Spotify Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-[#f7cba3]/70 rounded-2xl p-6 shadow-sm h-[65vh]">
              <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Disc size={20} />
                Music Player
              </h2>
              
              {spotifyConnected ? (
                <div className="space-y-6">
                  <SpotifyPlayer />
                  
                  <div className="overflow-y-auto max-h-[calc(100%-280px)] space-y-4">
                    {topArtists.length > 0 && (
                      <div className="bg-white/50 rounded-xl p-4">
                        <h3 className="font-medium text-gray-800 mb-3 text-sm flex items-center gap-2">
                          <Users size={14} />
                          Your Top Artists
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {topArtists.slice(0, 4).map(artist => (
                            <div key={artist.id} className="bg-white/50 p-2 rounded-lg text-xs">
                              {artist.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-white/50 rounded-xl p-4">
                      <h3 className="font-medium text-gray-800 mb-3 text-sm flex items-center gap-2">
                        <Disc size={14} />
                        Recent Albums
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {recentAlbums.slice(0, 4).map(album => (
                          <div key={album.id} className="bg-white/50 p-2 rounded-lg">
                            {album.imageUrl && (
                              <img 
                                src={album.imageUrl} 
                                alt={album.name}
                                className="w-full aspect-square object-cover rounded-md mb-1"
                              />
                            )}
                            <p className="text-xs truncate">{album.name}</p>
                            <p className="text-xs text-gray-500 truncate">{album.artist}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/50 rounded-xl p-4">
                      <h3 className="font-medium text-gray-800 mb-3 text-sm flex items-center gap-2">
                        <Music size={14} />
                        Your Playlists
                      </h3>
                      <div className="space-y-2">
                        {userPlaylists.slice(0, 3).map(playlist => (
                          <div key={playlist.id} className="bg-white/50 p-2 rounded-lg flex items-center gap-2">
                            {playlist.imageUrl ? (
                              <img 
                                src={playlist.imageUrl} 
                                alt={playlist.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded"></div>
                            )}
                            <div>
                              <p className="text-xs font-medium">{playlist.name}</p>
                              <p className="text-xs text-gray-500">{playlist.trackCount} tracks</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-6">Connect Spotify to create playlists</p>
                  <SpotifyConnect />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - News */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-[#ffb5b5]/70 rounded-2xl p-6 shadow-sm h-[65vh]">
              <h2 className="font-sans text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Music size={20} />
                Music News
              </h2>
              
              <div className="overflow-y-auto h-[calc(100%-70px)] pr-2">
                <NewsFeed />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}