const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.send('Welcome to the Pokemon Database');
});

module.exports = router;