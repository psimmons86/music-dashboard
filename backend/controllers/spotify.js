const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/user');

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Required scopes for Spotify API
const REQUIRED_SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-recently-played',
  'user-top-read',
  'user-read-currently-playing',
  'user-library-read',
  'playlist-read-private',
  'playlist-read-collaborative'
];

async function connect(req, res) {
  try {
    const state = Math.random().toString(36).substring(7);
    const authorizeURL = spotifyApi.createAuthorizeURL(REQUIRED_SCOPES, state);
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

    spotifyApi.setAccessToken(access_token);
    const me = await spotifyApi.getMe();
    
    await User.findByIdAndUpdate(req.user._id, {
      spotifyAccessToken: access_token,
      spotifyRefreshToken: refresh_token,
      spotifyTokenExpiry: new Date(Date.now() + expires_in * 1000),
      spotifyId: me.body.id
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
    res.json({ message: 'Successfully disconnected from Spotify' });
  } catch (error) {
    console.error('Spotify disconnect error:', error);
    res.status(500).json({ error: 'Failed to disconnect from Spotify' });
  }
}

async function getTopArtists(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user?.spotifyAccessToken) {
      return res.status(401).json({ error: 'No Spotify connection found' });
    }

    spotifyApi.setAccessToken(user.spotifyAccessToken);
    const response = await spotifyApi.getMyTopArtists({ limit: 5, time_range: 'medium_term' });
    
    res.json(response.body.items);
  } catch (error) {
    console.error('Error getting top artists:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getRecommendations(req, res) {
  try {
    const { genre, mood } = req.query;
    if (!genre || !mood) {
      return res.status(400).json({ error: 'Missing genre or mood parameter' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user?.spotifyAccessToken) {
      return res.status(401).json({ error: 'No Spotify connection found' });
    }
      
    spotifyApi.setAccessToken(user.spotifyAccessToken);
    
    const moodFeatures = {
      happy: { min_valence: 0.7, target_energy: 0.8 },
      chill: { max_energy: 0.5, target_valence: 0.5 },
      energetic: { min_energy: 0.7, target_danceability: 0.7 },  
      sad: { max_valence: 0.4, target_energy: 0.4 },
      focused: { target_energy: 0.5, max_danceability: 0.4 }
    };
    
    const recommendations = await spotifyApi.getRecommendations({
      seed_genres: [genre.toLowerCase()],
      limit: 20,
      ...moodFeatures[mood.toLowerCase()]
    });
    
    res.json(recommendations.body.tracks);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
}

async function getRecentAlbums(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user?.spotifyAccessToken) {
      return res.status(401).json({ error: 'No Spotify connection found' });
    }

    spotifyApi.setAccessToken(user.spotifyAccessToken);
    const response = await spotifyApi.getMySavedAlbums({ limit: 8 });
    
    res.json(response.body.items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserPlaylists(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user?.spotifyAccessToken) {
      return res.status(401).json({ error: 'No Spotify connection found' });
    }

    spotifyApi.setAccessToken(user.spotifyAccessToken);
    const response = await spotifyApi.getUserPlaylists(user.spotifyId, { limit: 6 });
    
    res.json(response.body.items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  connect,
  callback,
  status,
  disconnect,
  getTopArtists,
  getRecommendations,
  getRecentAlbums,
  getUserPlaylists,
  REQUIRED_SCOPES
};