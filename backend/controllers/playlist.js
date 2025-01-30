const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/user');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

async function createPlaylist(req, res) {
  try {
    // Get user and check Spotify connection
    const user = await User.findById(req.user._id);
    if (!user?.spotifyAccessToken) {
      return res.status(401).json({ error: 'No Spotify connection found' });
    }

    spotifyApi.setAccessToken(user.spotifyAccessToken);

    // Get user profile
    const me = await spotifyApi.getMe();
    console.log('Got user profile:', me.body.id);

    // Get recent tracks
    const recentTracks = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 5 });
    console.log('Got recent tracks:', recentTracks.body.items.length);

    if (!recentTracks.body.items.length) {
      return res.status(400).json({ error: 'No recent tracks found. Try playing some music first!' });
    }

    // Use recent tracks directly instead of recommendations
    const tracks = recentTracks.body.items
      .map(item => item.track)
      .filter((track, index, self) => 
        // Remove duplicates based on track ID
        index === self.findIndex((t) => t.id === track.id)
      );

    console.log('Creating playlist with tracks:', tracks.length);

    // Create timestamp for playlist name
    const timestamp = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Create the playlist
    const playlist = await spotifyApi.createPlaylist(me.body.id, {
      name: `Your Mix - ${timestamp}`,
      description: 'Custom playlist based on your recent listening',
      public: false
    });

    // Add tracks to playlist
    const trackUris = tracks.map(track => track.uri);
    if (trackUris.length > 0) {
      await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);
      console.log('Added tracks to playlist:', trackUris.length);
    }

    // Return playlist info
    return res.json({
      id: playlist.body.id,
      name: playlist.body.name,
      url: playlist.body.external_urls.spotify,
      embedUrl: `https://open.spotify.com/embed/playlist/${playlist.body.id}`,
      trackCount: trackUris.length
    });

  } catch (error) {
    console.error('Playlist creation error:', error);
    
    // Handle token expiration
    if (error.statusCode === 401) {
      await User.findByIdAndUpdate(req.user._id, {
        spotifyAccessToken: null,
        spotifyRefreshToken: null,
        spotifyTokenExpiry: null
      });
      return res.status(401).json({ 
        error: 'Please reconnect your Spotify account',
        reconnectRequired: true 
      });
    }

    // Handle other errors
    return res.status(500).json({ 
      error: 'Failed to create playlist',
      details: error.message
    });
  }
}

module.exports = { createPlaylist };