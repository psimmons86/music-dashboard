const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Initialize Spotify API with credentials
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
].join(' ');

async function connect(req, res) {
  try {
    // Generate state that includes user ID
    const state = req.user ? req.user._id.toString() : 'anonymous';
    
    // Create authorization URL
    const authorizeURL = spotifyApi.createAuthorizeURL(
      REQUIRED_SCOPES.split(' '),
      state
    );
    
    console.log('Generated Spotify authorize URL:', authorizeURL);
    res.json({ url: authorizeURL });
  } catch (error) {
    console.error('Spotify connect error:', error);
    res.status(500).json({ error: 'Failed to initialize Spotify connection' });
  }
}

async function callback(req, res) {
  try {
    const { code, state } = req.body;
    console.log('Received callback with code and state:', { code, state });

    if (!code) {
      throw new Error('No authorization code received');
    }

    // Get user from token
    let user;
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET);
      user = await User.findById(decoded.user._id);
    }

    if (!user) {
      throw new Error('User not found');
    }

    // Exchange code for tokens
    console.log('Exchanging code for tokens...');
    const data = await spotifyApi.authorizationCodeGrant(code);
    console.log('Token response received:', {
      expires_in: data.body.expires_in,
      access_token_received: Boolean(data.body.access_token),
      refresh_token_received: Boolean(data.body.refresh_token)
    });

    // Set tokens on API instance
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);

    // Get Spotify user profile
    console.log('Getting Spotify user profile...');
    const me = await spotifyApi.getMe();
    console.log('Spotify profile received:', {
      id: me.body.id,
      email: me.body.email
    });

    // Update user with Spotify data
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        spotifyAccessToken: data.body.access_token,
        spotifyRefreshToken: data.body.refresh_token,
        spotifyTokenExpiry: new Date(Date.now() + data.body.expires_in * 1000),
        spotifyId: me.body.id
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('Failed to update user with Spotify data');
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Spotify callback error:', error);
    res.status(error.statusCode || 500).json({
      error: 'Spotify callback failed',
      message: error.message
    });
  }
}

async function status(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isExpired = user.spotifyTokenExpiry && 
      new Date() > new Date(user.spotifyTokenExpiry);

    res.json({
      connected: Boolean(user.spotifyAccessToken && !isExpired),
      userId: user.spotifyId
    });
  } catch (error) {
    console.error('Spotify status error:', error);
    res.status(500).json({ error: 'Failed to check Spotify status' });
  }
}


async function disconnect(req, res) {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      spotifyAccessToken: null,
      spotifyRefreshToken: null,
      spotifyTokenExpiry: null,
      spotifyId: null
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