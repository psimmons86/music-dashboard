const mongoose = require('mongoose');

const weeklyPlaylistSchema = new mongoose.Schema({
  spotifyPlaylistId: {
    type: String,
    required: true
  },
  embedUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  weekNumber: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Index for faster queries
weeklyPlaylistSchema.index({ active: 1, createdAt: -1 });

// Ensure only one active playlist at a time
weeklyPlaylistSchema.pre('save', async function(next) {
  if (this.active && this.isModified('active')) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { active: false }
    );
  }
  next();
});

module.exports = mongoose.model('WeeklyPlaylist', weeklyPlaylistSchema);