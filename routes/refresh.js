const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controller/refreshTokenController');

router.get("/", refreshTokenController.handleRefreshToken);

module.exports = router;
// This code sets up a route for handling refresh tokens in an Express application.