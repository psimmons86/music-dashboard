import { useState } from 'react';
import * as playlistService from '../../services/playlistService';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Music } from 'lucide-react';

export default function PlaylistCard({ 
  title = 'Generate Playlist', 
  actionButtonText = 'Create Playlist',
  loadingText = 'Generating...',
  onPlaylistCreated 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [playlist, setPlaylist] = useState(null);

  async function handleCreatePlaylist() {
    try {
      setError('');
      setLoading(true);

      const response = await playlistService.create();
      
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

  return (
    <Card className="w-full h-full bg-white/60">
      <CardContent className="p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {playlist && playlist.embedUrl ? (
          <div className="w-full aspect-square">
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
        ) : (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Music className="w-12 h-12 text-emerald-600" />
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
      </CardContent>
    </Card>
  );
}