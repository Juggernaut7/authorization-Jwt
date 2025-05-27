const express = require('express');
const router = express.Router();
const logoutController = require('../controller/logoutController');
// Route to handle user logout
router.get('/', logoutController.handleLogout);
// Export the router
module.exports = router;