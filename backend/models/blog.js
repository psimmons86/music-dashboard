const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  content: { 
    type: String, 
    required: true 
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Music News', 'Artist Spotlight', 'General', 'Reviews', 'Tutorials']
  },
  tags: [{
    type: String,
    trim: true
  }],
  summary: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  viewCount: {
    type: Number,
    default: 0
  },
  revisions: [{
    content: String,
    updatedAt: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);