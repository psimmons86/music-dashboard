const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/user');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

async function createPlaylist(req, res) {
  try {

    const user = await User.findById(req.user._id);
    if (!user?.spotifyAccessToken) {
      return res.status(401).json({ error: 'No Spotify connection found' });
    }


    spotifyApi.setAccessToken(user.spotifyAccessToken);


    const me = await spotifyApi.getMe();
    console.log('Got user profile:', me.body.id);


    const recentTracks = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 });
    console.log('Got recent tracks:', recentTracks.body.items.length);

    if (!recentTracks.body.items.length) {
      return res.status(400).json({ error: 'No recent tracks found. Try playing some music first!' });
    }

    const playlist = await spotifyApi.createPlaylist(me.body.id, {
      name: `Daily Mix - ${new Date().toLocaleDateString()}`,
      description: 'Generated from your recently played tracks',
      public: false
    });
    console.log('Created playlist:', playlist.body.id);

    const trackUris = [...new Set(
      recentTracks.body.items.map(item => item.track.uri)
    )].slice(0, 20);
    await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);
    console.log('Added tracks to playlist');

    return res.json({
      id: playlist.body.id,
      name: playlist.body.name,
      url: playlist.body.external_urls.spotify,
      embedUrl: `https://open.spotify.com/embed/playlist/${playlist.body.id}`,
      trackCount: trackUris.length
    });

  } catch (error) { 
    console.error('Playlist creation error:', error);
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
    return res.status(500).json({ error: 'Failed to create playlist' });
  }
}

module.exports = { createPlaylist };