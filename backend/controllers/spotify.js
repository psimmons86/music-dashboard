const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/user');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

async function connect(req, res) {
  try {
    const scopes = ['user-read-private', 'playlist-modify-public', 'playlist-modify-private'];
    const state = Math.random().toString(36).substring(7);
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
    res.json({ url: authorizeURL });
  } catch (error) {
    console.error('Spotify connect error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function callback(req, res) {
  try {
    const { code } = req.body;
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    await User.findByIdAndUpdate(req.user._id, {
      spotifyAccessToken: access_token,
      spotifyRefreshToken: refresh_token,
      spotifyTokenExpiry: new Date(Date.now() + expires_in * 1000)
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Spotify callback error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function status(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ connected: Boolean(user.spotifyAccessToken) });
  } catch (error) {
    console.error('Spotify status error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function disconnect(req, res) {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      spotifyAccessToken: null,
      spotifyRefreshToken: null,
      spotifyTokenExpiry: null
    });
    res.json({ message: 'Spotify disconnected successfully' });
  } catch (error) {
    console.error('Spotify disconnect error:', error);
    res.status(500).json({ error: 'Failed to disconnect Spotify' });
  }
}

async function getAvailableGenreSeeds(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user.spotifyAccessToken) {
      return res.status(401).json({ error: 'No Spotify connection found' });
    }

    // Log the access token for debugging
    console.log('Spotify Access Token:', user.spotifyAccessToken);

    // Check if the token is expired
    if (user.spotifyTokenExpiry && new Date() > new Date(user.spotifyTokenExpiry)) {
      return res.status(401).json({ error: 'Spotify access token expired. Please reconnect.' });
    }

    spotifyApi.setAccessToken(user.spotifyAccessToken);

    // Fetch available genre seeds
    const genreSeeds = await spotifyApi.getAvailableGenreSeeds();
    
    // Filter genres to only include the selected ones
    const selectedGenres = ["alternative", "ambient", "electronic", "emo", "hip-hop", "indie", "indie-pop", "k-pop", "pop", "rock", "synth-pop"];
    const filteredGenres = genreSeeds.body.genres.filter(genre => selectedGenres.includes(genre));

    res.json({ genres: filteredGenres });
  } catch (error) {
    console.error('Error fetching genre seeds:', {
      message: error.message,
      statusCode: error.statusCode,
      body: error.body,
      headers: error.headers
    });
    res.status(500).json({ error: 'Failed to fetch genre seeds', details: error.message });
  }
}

module.exports = { connect, callback, status, disconnect, getAvailableGenreSeeds };