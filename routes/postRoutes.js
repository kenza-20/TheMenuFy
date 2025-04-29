const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPostById, deletePost } = require('../controlleurs/postController');

// Routes
router.post('/', createPost);           // Create a new blog post
router.get('/', getAllPosts);            // Get all blog posts
router.get('/:id', getPostById);          // Get a single blog post by ID (optional)
router.delete('/:id', deletePost);        // Delete a blog post by ID (optional)

module.exports = router;
