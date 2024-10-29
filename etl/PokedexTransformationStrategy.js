// here we create the strategy for transforming Pokedex data
const axios = require('axios');
const DataBuilder = require('./DataBuilder');

class PokedexTransformationStrategy {
    async fetchAdditionalData(id) {
        const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
        const response = await axios.get(url);
        return response.data;
    }
    async transform(data) {

        const additionalData = await this.fetchAdditionalData(data.id);

        const transformed = {
            name: data.name,
            url: `https://pokeapi.co/api/v2/pokemon/${data.name}/`,
            stat_total: data.stats.reduce((sum,stat) => sum + stat.base_stat,0),
            hp: data.stats.find(s => s.stat.name === 'hp').base_stat,
            atk: data.stats.find(s => s.stat.name === 'attack').base_stat,
            def: data.stats.find(s => s.stat.name === 'defense').base_stat,
            spatk: data.stats.find(s => s.stat.name === 'special-attack').base_stat,
            spdef: data.stats.find(s => s.stat.name === 'special-defense').base_stat,
            spd: data.stats.find(s => s.stat.name === 'speed').base_stat,
            catch_rate: additionalData.capture_rate,
            base_exp: data.base_experience,
            base_happiness: additionalData.base_happiness, 
            entry: additionalData.flavor_text_entries.find(text => text.language.name === 'en')?.flavor_text || '',
            height: data.height / 10,
            weight: data.weight / 10,
        };

        return new DataBuilder()
            .setData(transformed)
            .setColumns(['name','url','stat_total','hp','atk','def','spatk','spdef','spd','catch_rate','base_exp','base_happiness','entry','height','weight'])
            .setConflictColumn('id');
    }
}

module.exports = PokedexTransformationStrategy;