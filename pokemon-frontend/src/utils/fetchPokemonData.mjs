import fetch from 'node-fetch';
import { writeFileSync } from 'fs';

const fetchPokemonData = async () => {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
        const data = await response.json();
        const pokemonMap = data.results.reduce((map, pokemon) => {
            const id = pokemon.url.split('/').filter(Boolean).pop();
            map[pokemon.name.toLowerCase()] = id;
            return map;
        }, {});

        writeFileSync('pokemonMap.json', JSON.stringify(pokemonMap, null, 2));
        console.log('Pokemon data saved to pokemonMap.json');
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
};

fetchPokemonData();
