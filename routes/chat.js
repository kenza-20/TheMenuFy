const express = require("express");
const router = express.Router();
const { askMenuBot } = require("../controlleurs/chatController");

// POST /api/chat
router.post("/", askMenuBot);

module.exports = router;
