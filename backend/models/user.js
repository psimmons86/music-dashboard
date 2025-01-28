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
  favoriteMoods: [{
    type: String
  }]
}, {
  timestamps: true
});

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

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.updateSpotifyTokens = function(accessToken, refreshToken, expiryDate) {
  this.spotifyAccessToken = accessToken;
  this.spotifyRefreshToken = refreshToken;
  this.spotifyTokenExpiry = expiryDate;
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;