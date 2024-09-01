const express = require('express');
const router = express.Router();
const { filterPokedex } = require('../controllers/pokedexController');

router.get('/pokeFilter',filterPokedex);

module.exports = router;