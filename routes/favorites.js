const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Recipe = require('../models/Recipe');
const userController = require('../controlleurs/userController');
const favoritesController = require('../controlleurs/favoritesController');

router.post("/add", favoritesController.addToFavorites)
router.post("/remove", favoritesController.removeFromFavorites)
router.get("/:userId", favoritesController.getUserFavorites)
router.get("/check/:userId/:dishId", favoritesController.checkFavorite)


module.exports = router;