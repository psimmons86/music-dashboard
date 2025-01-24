const SpotifyWebApi = require('spotify-web-api-node');

async function createPlaylist(req, res) {
  const { name, genre, mood } = req.body;
  const spotifyApi = new SpotifyWebApi({
    accessToken: req.user.spotifyAccessToken
  });

  try {
    const playlist = await spotifyApi.createPlaylist(name, { 
      description: `${mood} ${genre} playlist` 
    });
    
    const tracks = await getTracksByGenreAndMood(spotifyApi, genre, mood);
    await spotifyApi.addTracksToPlaylist(playlist.body.id, tracks.map(t => t.uri));

    res.json(playlist.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getTracksByGenreAndMood(spotifyApi, genre, mood) {
  const moodFeatures = {
    happy: { min_valence: 0.7, target_energy: 0.8 },
    chill: { max_energy: 0.5, target_valence: 0.5 },
    energetic: { min_energy: 0.7, target_danceability: 0.7 }
  };

  const response = await spotifyApi.getRecommendations({
    seed_genres: [genre],
    limit: 20,
    ...moodFeatures[mood]
  });

  return response.body.tracks;
}

module.exports = { createPlaylist };