import { useState, useEffect } from 'react';
import * as playlistService from '../../services/playlistService';
import { Loader2, Music, BarChart2, Disc } from 'lucide-react';

export default function PlaylistCard({ 
  title = 'Music Player', 
  actionButtonText = 'Create Playlist',
  loadingText = 'Generating...',
  onPlaylistCreated 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [playlist, setPlaylist] = useState(null);
  const [stats, setStats] = useState({
    topArtists: [],
    topAlbums: [],
    topGenres: []
  });

  async function handleCreatePlaylist() {
    try {
      setError('');
      setLoading(true);

      const response = await playlistService.create();
      console.log('Playlist created:', response);
      
      if (response?.url || response?.embedUrl) {
        setPlaylist(response);
        onPlaylistCreated?.(response);
      }
    } catch (err) {
      console.error('Playlist creation error:', err);
      
      if (err.message?.includes('reconnect')) {
        setError('Please reconnect your Spotify account');
      } else {
        setError(err.message || 'Failed to create playlist');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await playlistService.getUserStats();
        setStats(response);
      } catch (err) {
        console.error('Failed to fetch user stats:', err);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-emerald-800 flex items-center gap-2 text-xl font-semibold">
          <Music className="h-5 w-5" />
          {title}
        </h2>
      </div>

      {/* Content */}
      <div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {playlist && playlist.embedUrl ? (
          <div className="space-y-6">
            {/* Spotify Player */}
            <div className="w-full h-[600px]">
              <iframe
                src={playlist.embedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
              />
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Top Artists */}
              <div className="space-y-3">
                <h3 className="text-emerald-800 font-medium flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Top Artists
                </h3>
                <div className="space-y-2">
                  {stats.topArtists && stats.topArtists.length > 0 ? (
                    <ul className="space-y-2">
                      {stats.topArtists.map((artist, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center justify-between border-b border-gray-100 pb-2">
                          <span>{artist.name}</span>
                          <span className="text-xs text-emerald-600 font-medium">#{index + 1}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Loading artist data...</p>
                  )}
                </div>
              </div>

              {/* Top Albums */}
              <div className="space-y-3">
                <h3 className="text-emerald-800 font-medium flex items-center gap-2">
                  <Disc className="h-4 w-4" />
                  Top Albums
                </h3>
                <div className="space-y-2">
                  {stats.topAlbums && stats.topAlbums.length > 0 ? (
                    <ul className="space-y-2">
                      {stats.topAlbums.map((album, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center justify-between border-b border-gray-100 pb-2">
                          <span>{album.name}</span>
                          <span className="text-xs text-emerald-600 font-medium">#{index + 1}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Loading album data...</p>
                  )}
                </div>
              </div>

              {/* Top Genres */}
              <div className="space-y-3">
                <h3 className="text-emerald-800 font-medium flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Top Genres
                </h3>
                <div className="space-y-2">
                  {stats.topGenres && stats.topGenres.length > 0 ? (
                    <ul className="space-y-2">
                      {stats.topGenres.map((genre, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center justify-between border-b border-gray-100 pb-2">
                          <span>{genre.name}</span>
                          <span className="text-xs text-emerald-600 font-medium">#{index + 1}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Loading genre data...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Music className="w-12 h-12 text-emerald-600" />
            <p className="text-gray-600 text-sm text-center mb-4">
              Generate a playlist with 20 randomly selected songs from your Spotify favorites!
            </p>
            <button
              onClick={handleCreatePlaylist}
              disabled={loading}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? loadingText : actionButtonText}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}