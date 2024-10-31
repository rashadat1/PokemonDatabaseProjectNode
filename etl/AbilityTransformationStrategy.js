const axios = require('axios');
const DataBuilder = require('./DataBuilder');

class AbilityTransformationStrategy {
    async transform(data) {
        const mainAbilityData = {
            id: data.id,
            name: data.name,
            description: data.effect_entries.find(s => s.language.name === 'en')?.effect,
        };

        return new DataBuilder()
            .setData(mainAbilityData)
            .setColumns(['id','name','description'])
            .setConflictColumn('id');
    }
}

module.exports = AbilityTransformationStrategy;