const mongoose = require('mongoose');

const weeklyPlaylistSchema = new mongoose.Schema({
  spotifyPlaylistId: String,
  embedUrl: String,
  title: String,
  description: String,
  weekNumber: Number,
  year: Number,
  active: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeeklyPlaylist', weeklyPlaylistSchema);