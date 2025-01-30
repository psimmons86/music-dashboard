const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Spotify related fields
  spotifyAccessToken: String,
  spotifyRefreshToken: String,
  spotifyTokenExpiry: Date,
  spotifyId: String,
  
  // Other user fields
  profilePicture: {
    type: String,
    default: '/default-profile.png'
  },
  favoriteGenres: [{
    type: String,
    enum: ['Rock', 'Hip Hop', 'Electronic', 'Pop', 'Jazz', 'Classical', 'R&B', 'Country', 'Metal', 'Folk', 'Blues']
  }],
  favoriteMoods: [{
    type: String,
    enum: ['Happy', 'Chill', 'Energetic', 'Sad', 'Focused']
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(tryPassword) {
  return bcrypt.compare(tryPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);