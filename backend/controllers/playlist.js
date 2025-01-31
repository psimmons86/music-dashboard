const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/user');

async function createPlaylist(req, res) {
  try {
    // Get user and check Spotify connection
    const user = await User.findById(req.user._id);
    if (!user?.spotifyAccessToken) {
      return res.status(401).json({ error: 'No Spotify connection found' });
    }

    // Initialize Spotify API
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      accessToken: user.spotifyAccessToken
    });

    // Get user profile
    const me = await spotifyApi.getMe();

    try {
      // Fetch user's saved tracks
      const savedTracks = await spotifyApi.getMySavedTracks({ limit: 50 });
      
      // If no saved tracks, return error
      if (!savedTracks.body.items.length) {
        return res.status(400).json({ 
          error: 'No saved tracks found. Save some tracks on Spotify first!' 
        });
      }

      // Shuffle tracks
      const shuffledTracks = savedTracks.body.items
        .sort(() => 0.5 - Math.random())
        .slice(0, 30); // Limit to 30 tracks

      // Create playlist
      const playlistName = `Daily Mix - ${new Date().toLocaleDateString()}`;
      const playlist = await spotifyApi.createPlaylist(me.body.id, {
        name: playlistName,
        description: 'Shuffled daily playlist of your favorite tracks',
        public: false
      });

      // Add tracks to playlist
      const trackUris = shuffledTracks.map(item => item.track.uri);
      await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);

      // Return playlist details
      return res.json({
        id: playlist.body.id,
        name: playlist.body.name,
        url: playlist.body.external_urls.spotify,
        embedUrl: `https://open.spotify.com/embed/playlist/${playlist.body.id}`,
        trackCount: trackUris.length
      });

    } catch (spotifyError) {
      console.error('Spotify playlist creation error:', spotifyError);
      
      // Handle token expiration
      if (spotifyError.statusCode === 401) {
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

      return res.status(500).json({ 
        error: 'Failed to create playlist',
        details: spotifyError.message
      });
    }

  } catch (error) {
    console.error('Playlist creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create playlist',
      details: error.message
    });
  }
}

module.exports = { createPlaylist };