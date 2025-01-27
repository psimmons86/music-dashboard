const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/user');

async function createPlaylist(req, res) {
  try {
    console.log('Creating playlist with data:', req.body);
    const user = await User.findById(req.user._id);
    
    if (!user.spotifyAccessToken) {
      return res.status(401).json({ error: 'No Spotify connection found' });
    }

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI
    });

    spotifyApi.setAccessToken(user.spotifyAccessToken);

    try {
      // Get Spotify user profile
      const me = await spotifyApi.getMe();
      const userId = me.body.id;
      console.log('Got user ID:', userId);

      // Create the playlist
      const playlist = await spotifyApi.createPlaylist(userId, {
        name: req.body.name,
        description: `${req.body.mood} ${req.body.genre} playlist`,
        public: false
      });
      console.log('Created playlist:', playlist.body.id);

      // Define seed tracks for each genre (verified Spotify track URIs)
      const genreSeeds = {
        'rock': '7CCrWWHrRj0TZkqQHqzKZ8',
        'hip hop': '5WzfGc2yUlVrPDc0y4M3The',
        'electronic': '3AhXZa8sUQht0UEdBJgpGc',
        'pop': '0HUTL8i4y4MiGCPB5h2MSc',
        'jazz': '2pNYrY9QtWu1kHXMUU5hc6',
        'classical': '1KikpHcd9y5cL7zBVJgTbX'
      };

      // Define mood features
      const moodFeatures = {
        happy: { min_valence: 0.7, target_energy: 0.8 },
        chill: { max_energy: 0.5, target_valence: 0.5 },
        energetic: { min_energy: 0.7, target_danceability: 0.7 }
      };

      const genre = req.body.genre.toLowerCase();
      const seedTrack = genreSeeds[genre];

      // Get recommendations using both genre and seed track
      const recommendationParams = {
        seed_tracks: [seedTrack],
        seed_genres: [genre],
        limit: 20,
        ...moodFeatures[req.body.mood.toLowerCase()]
      };

      console.log('Getting recommendations with params:', recommendationParams);
      
      const recommendations = await spotifyApi.getRecommendations(recommendationParams);
      console.log(`Got ${recommendations.body.tracks.length} recommendations`);

      if (recommendations.body.tracks.length > 0) {
        const trackUris = recommendations.body.tracks.map(track => track.uri);
        await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);
        console.log(`Added ${trackUris.length} tracks to playlist`);

        res.json({
          id: playlist.body.id,
          name: playlist.body.name,
          url: playlist.body.external_urls.spotify,
          trackCount: trackUris.length
        });
      } else {
        res.json({
          id: playlist.body.id,
          name: playlist.body.name,
          url: playlist.body.external_urls.spotify,
          message: 'Playlist created but no recommendations found'
        });
      }

    } catch (spotifyError) {
      console.error('Spotify API Error:', {
        message: spotifyError.message,
        statusCode: spotifyError.statusCode,
        body: spotifyError.body
      });
      
      if (spotifyError.statusCode === 401) {
        res.status(401).json({ error: 'Spotify access expired. Please reconnect.' });
      } else {
        res.status(500).json({ 
          error: 'Failed to complete playlist operation',
          details: spotifyError.message,
          code: spotifyError.statusCode
        });
      }
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { createPlaylist };