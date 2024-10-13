const express = require('express');
const router = express.Router();
const { filterPokedex, pokemonSummary } = require('../controllers/pokedexController');

router.get('/pokeFilter',filterPokedex);
router.get('/pokemonSummary',pokemonSummary);

module.exports = router;