const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/user');

// Existing createPlaylist function
async function createPlaylist(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user?.spotifyAccessToken) {
      return res.status(401).json({ error: 'No Spotify connection found' });
    }

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      accessToken: user.spotifyAccessToken
    });

    const me = await spotifyApi.getMe();
    const savedTracks = await spotifyApi.getMySavedTracks({ limit: 50 });
    
    if (!savedTracks.body.items.length) {
      return res.status(400).json({ 
        error: 'No saved tracks found. Save some tracks on Spotify first!' 
      });
    }

    const shuffledTracks = savedTracks.body.items
      .sort(() => 0.5 - Math.random())
      .slice(0, 20);

    const playlistName = `Daily Mix - ${new Date().toLocaleDateString()}`;
    const playlist = await spotifyApi.createPlaylist(me.body.id, {
      name: playlistName,
      description: 'Your daily mix of favorite tracks',
      public: false
    });

    const trackUris = shuffledTracks.map(item => item.track.uri);
    await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);

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
      return res.status(401).json({ 
        error: 'Please reconnect your Spotify account',
        reconnectRequired: true 
      });
    }
    res.status(500).json({ 
      error: 'Failed to create playlist',
      details: error.message
    });
  }
}

async function getUserStats(req, res) {
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

    try {
      // Get user's top items
      const [topArtists, topTracks] = await Promise.all([
        spotifyApi.getMyTopArtists({ limit: 5, time_range: 'short_term' }),
        spotifyApi.getMyTopTracks({ limit: 20, time_range: 'short_term' })
      ]);

      // Process top artists
      const processedArtists = topArtists.body.items.map(artist => ({
        name: artist.name,
        id: artist.id,
        popularity: artist.popularity
      }));

      // Process albums from top tracks
      const albumsMap = new Map();
      topTracks.body.items.forEach(track => {
        const album = track.album;
        if (!albumsMap.has(album.id)) {
          albumsMap.set(album.id, {
            name: album.name,
            id: album.id,
            count: 1
          });
        } else {
          albumsMap.get(album.id).count++;
        }
      });

      const processedAlbums = Array.from(albumsMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Process genres from top artists
      const genresMap = new Map();
      topArtists.body.items.forEach(artist => {
        artist.genres.forEach(genre => {
          genresMap.set(genre, (genresMap.get(genre) || 0) + 1);
        });
      });

      const processedGenres = Array.from(genresMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      res.json({
        topArtists: processedArtists,
        topAlbums: processedAlbums,
        topGenres: processedGenres
      });

    } catch (spotifyError) {
      console.error('Spotify API error:', spotifyError);
      
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

      throw spotifyError;
    }

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user statistics',
      details: error.message
    });
  }
}

module.exports = {
  createPlaylist,
  getUserStats
};