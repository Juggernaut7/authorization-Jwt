const express = require('express')
const router = express.Router()
const path = require('path')

router.get(/^\/$|\/index(.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', "Views",'subdir', "index.html"));
});

router.get(/^\/$|\/test(.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', "Views",'subdir', "test.html"));
});

module.exports = router