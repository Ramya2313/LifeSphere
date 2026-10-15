
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/userController");

const router = express.Router();

// Protected route: requires a valid JWT
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
