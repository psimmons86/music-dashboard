const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

const REQUIRED_SCOPES = [
  'user-library-read',
  'playlist-modify-private',
  'playlist-modify-public'
].join(' ');

const spotifyController = {
  async connect(req, res) {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: 'You must be logged in to connect Spotify' });
      }

      // Generate state with user ID
      const state = req.user._id.toString();
      
      // Create authorization URL
      const authorizeURL = spotifyApi.createAuthorizeURL(
        REQUIRED_SCOPES.split(' '),
        state,
        true // Force user approval
      );
      
      console.log('Generated Spotify authorize URL:', authorizeURL);
      res.json({ url: authorizeURL });
    } catch (error) {
      console.error('Spotify connect error:', error);
      res.status(500).json({ error: 'Failed to initialize Spotify connection' });
    }
  },

  async callback(req, res) {
    try {
      const { code, state } = req.body;
      console.log('Received callback with code and state:', { code, state });

      if (!code) {
        throw new Error('No authorization code received');
      }

      // Get user from token
      if (!req.user) {
        throw new Error('No authenticated user found');
      }

      // Exchange code for tokens
      const data = await spotifyApi.authorizationCodeGrant(code);
      console.log('Received Spotify tokens');

      // Set tokens for getting user profile
      spotifyApi.setAccessToken(data.body.access_token);
      const spotifyUser = await spotifyApi.getMe();

      // Update user with Spotify data
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          spotifyAccessToken: data.body.access_token,
          spotifyRefreshToken: data.body.refresh_token,
          spotifyTokenExpiry: new Date(Date.now() + data.body.expires_in * 1000),
          spotifyId: spotifyUser.body.id
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
  },

  async status(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

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
  },

  async disconnect(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await User.findByIdAndUpdate(req.user._id, {
        spotifyAccessToken: null,
        spotifyRefreshToken: null,
        spotifyTokenExpiry: null,
        spotifyId: null
      }, { new: true });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ 
        message: 'Successfully disconnected from Spotify',
        success: true 
      });
    } catch (error) {
      console.error('Spotify disconnect error:', error);
      res.status(500).json({ error: 'Failed to disconnect from Spotify' });
    }
  }
};

module.exports = spotifyController;