const express = require("express")
const router = express.Router()
const path = require("path")



router.get(/^\/$|\/index(.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname,'..', "Views", "index.html"));
});

router.get(/^\/$|\/New-page(.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname,'..', "Views", "New-page.html"));
});

router.get(/test(.html)?/, (req, res) => {
    res.redirect(301, "index.html")
})

module.exports = router