const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/user');

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Define all required scopes
const REQUIRED_SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-recently-played',
  'user-top-read',
  'user-read-currently-playing'
];

// Connect to Spotify
router.get('/connect', async (req, res) => {
  try {
    const state = Math.random().toString(36).substring(7);
    const authorizeURL = spotifyApi.createAuthorizeURL(REQUIRED_SCOPES, state);
    res.json({ url: authorizeURL });
  } catch (error) {
    console.error('Spotify connect error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Callback after Spotify authorization
router.post('/callback', async (req, res) => {
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
});

// Check Spotify connection status
router.get('/status', async (req, res) => {
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
});

// Disconnect Spotify
router.post('/disconnect', async (req, res) => {
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
});

// Get top artists
router.get('/top-artists', async (req, res) => {
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
  });

// Get recommendations
router.get('/recommendations', async (req, res) => {
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
    
    // Define mood features  
    const moodFeatures = {
      happy: { min_valence: 0.7, target_energy: 0.8 },
      chill: { max_energy: 0.5, target_valence: 0.5 },
      energetic: { min_energy: 0.7, target_danceability: 0.7 },  
      sad: { max_valence: 0.4, target_energy: 0.4 },
      angry: { min_energy: 0.8, target_valence: 0.3 }
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
});

module.exports = router;