import { connectSpotify } from '../../services/spotifyService';

export default function SpotifyConnect() {
  return (
    <button 
      onClick={connectSpotify}
      className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
    >
      Connect Spotify
    </button>
  );
}