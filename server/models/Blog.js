const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    minlength: 5,
  },
  author: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Array of image filenames
    default: [], // Default to an empty array
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: ['rooms', 'tasks', 'general'], // Added 'general' as a valid category
    required: true, // This ensures that the category must be specified when adding a blog
  },
  rating: {
    type: Number,
    default: 0, // Default rating is 0
    min: 0, // Minimum rating is 0
    max: 5, // Maximum rating is 5
  },
  ratingCount: {
    type: Number,
    default: 0, // Default number of ratings is 0
  },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;