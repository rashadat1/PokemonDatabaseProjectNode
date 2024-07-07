const express = require('express');
const router = express.Router();
const { search } = require('../controllers/searchbarController');

// the base route will be defined as /api/search in app.js so all
// routes beginning with /api/search will be handled by search in
// searchbarcontroller
router.get('/', search);

module.exports = router;