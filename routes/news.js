const express = require('express');
const router = express.Router();
const fetchNews = require('../utils/fetchPokemonNews');

router.get('/', async (req,res) => {
    console.log('Handling request')
    const news = await fetchNews();
    res.json(news);
});

module.exports = router;