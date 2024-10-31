const ETL = require('./ETL');
const AbilityTransformationStrategy = require('./AbilityTransformationStrategy');
const axios = require('axios');

class AbilityETL extends ETL {
    // subclass of the ETL super class
    constructor(pool) {
        super(pool, 'abilities');
        this.transformationStrategy = new AbilityTransformationStrategy();
    }

    // endpoint to fetch individual abilities 
    getEndpoint(id) {
        return `https://pokeapi.co/api/v2/ability/${id}/`;
    }

    async transformData(rawData) {
        return this.transformationStrategy.transform(rawData);
    }

    async processAllAbilities() {
        // total number of abilities in the API
        const abilityCount = 307;
        await this.processRange(1, abilityCount);
        console.log('ETL for Abilities completed');
    }
    
}

module.exports = AbilityETL;