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
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.json({ url: authorizeURL });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Spotify auth URL' });
  }
}

async function callback(req, res) {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      spotifyAccessToken: access_token,
      spotifyRefreshToken: refresh_token
    });

    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect Spotify account' });
  }
}

async function status(req, res) {
  try {
    const connected = req.user.spotifyAccessToken ? true : false;
    res.json({ connected });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check Spotify status' });
  }
}

module.exports = { connect, callback, status };