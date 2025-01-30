const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: { 
    type: String, 
    required: true 
  },
  currentSong: {
    type: String,
    default: ''
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
}, {
  timestamps: true
});


module.exports = mongoose.model('Post', postSchema);