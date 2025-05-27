 const express = require('express');
const router = express.Router();
const {handleNewUser, handleLogin} = require('../controller/userController');


router.post("/registerUser",handleNewUser);
router.post("/login", handleLogin);

module.exports = router;