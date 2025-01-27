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
  spotifyId: {
    type: String,
    default: null
  },
  spotifyAccessToken: {
    type: String,
    default: null
  },
  spotifyRefreshToken: {
    type: String,
    default: null
  },
  spotifyTokenExpiry: {
    type: Date,
    default: null
  },
  favoriteGenres: [{
    type: String
  }],
  profileImage: {
    type: String,
    default: null
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'favoriteType'
  }],
  favoriteGenres: [{
    type: String
  }],
  favoriteMoods: [{
    type: String
  }],
  favoriteType: {
    type: String,
    enum: ['Article', 'Playlist', 'BlogPost']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to handle Spotify token update
userSchema.methods.updateSpotifyTokens = function(accessToken, refreshToken) {
  this.spotifyAccessToken = accessToken;
  this.spotifyRefreshToken = refreshToken;
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;