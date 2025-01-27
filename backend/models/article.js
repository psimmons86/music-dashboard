const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String,
    default: ''
  },
  url: { 
    type: String, 
    required: true 
  },
  urlToImage: { 
    type: String,
    default: ''
  },
  publishedAt: { 
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);