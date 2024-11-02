const axios = require('axios');
const PokedexTransformationStrategy = require('./pokedexTransformationStrategy');

class PokedexETL extends ETL {
    constructor(pool) {
        super(pool, 'pokedex', ['pokemon_abilities', 'ev_yield', 'pokemon_types']);
        this.transformationStrategy = new PokedexTransformationStrategy();
    }

    getEndpoint(id) {
        return `https://pokeapi.co/api/v2/pokemon/${id}/`;
    }

    async transformData(rawData) {
        return this.transformationStrategy.transform(rawData);
    }

    async processAllPokemon() {
        // Implement this method
        const pokemonCount = 1025;
        await this.processRange(1, pokemonCount);
        console.log('ETL for Pokedex completed');
    }

}

module.exports = PokedexETL;