const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'General'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
