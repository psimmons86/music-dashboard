import { connectSpotify } from '../../services/spotifyService';

export default function SpotifyConnect() {
  const handleConnect = async () => {
    try {
      const response = await connectSpotify();
      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Error connecting to Spotify:', error);
    }
  };

  return (
    <button
      onClick={handleConnect}
      className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
    >
      Connect Spotify
    </button>
  );
}