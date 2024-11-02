// here we create the strategy for transforming Pokedex data

// TBD create learnsets table
const axios = require('axios');
const DataBuilder = require('./DataBuilder');

class PokedexTransformationStrategy {
    constructor(pool) {
        this.pool = pool; // PostgreSQL connection pool to fetch ability IDs
    }
    // Method to get ability ID from name from the abilities table
    async getAbilityId(abilityName) {
        const result = await this.pool.query('SELECT id FROM abilities WHERE name ILIKE $1', [abilityName]);
        return result.rows[0]?.id;
    }
    // Method to get type ID from typeName from the types table
    async getTypeId(typeName) {
        const result = await this.pool.query('SELECT id FROM types WHERE type_name ILIKE $1', [typeName]);
        return result.rows[0]?.id;
    }

    async fetchAdditionalData(url) {
        const response = await axios.get(url);
        return response.data;
    }
    // Transform Pokemon data for insertion into pokedex and pokemon_abilities tables
    async transform(data) {

        let species_url = data.species.url;
        const additionalData = await this.fetchAdditionalData(species_url);

        const transformed = {
            id: data.id,
            name: data.name,
            url: `https://pokeapi.co/api/v2/pokemon/${data.id}/`,
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

        // Gather abilities for the pokemon_abilities junction table
        const pokemonAbilities = [];
        for (const ability of data.abilities) {
            const abilityName = ability.ability.name;
            const abilityId = await this.getAbilityId(abilityName);
            if (abilityId) {
                pokemonAbilities.push({
                    pokemon_id: data.id,
                    ability_id: abilityId,
                    is_hidden: ability.is_hidden
                });
            }
        }

        const types = [];
        for (const type of data.types) {
            const typeName = type.type.name;
            const typeId = await this.getTypeId(typeName);
            if (typeId) {
                types.push({
                    pokemon_id: data.id,
                    type_id: typeId
                });
            }
        }
        // Gather non-zero EV Yields for ev_yield table
        const evYields = data.stats
            .filter(stat => stat.effort > 0)
            .map(stat => ({
                pokemon_id: data.id,
                stat_name: stat.stat.name,
                ev_yield: stat.effort,
            }));
        return {
            mainData: new DataBuilder()
                .setData(transformed)
                .setColumns(['id','name','url','stat_total','hp','atk','def','spatk','spdef','spd','catch_rate','base_exp','base_happiness','entry','height','weight'])
                .setConflictColumn('id'),
            junctionData: {
                pokemon_abilities: pokemonAbilities.map(ability => 
                    new DataBuilder()
                        .setData(ability)
                        .setColumns(['pokemon_id','ability_id','is_hidden']))
                        .setConflictColumn(['pokemon_id','ability_id']
                ),
                ev_yield: evYields.map(ev =>
                    new DataBuilder()
                        .setData(ev)
                        .setColumns(['pokemon_id','stat_name','ev_yield'])
                        .setConflictColumn(['pokemon_id','stat_name'])
                ),
                pokemon_types: types.map(type =>
                    new DataBuilder()
                        .setData(type)
                        .setColumns(['pokemon_id','type_id'])
                        .setConflictColumn(['pokemon_id','type_id'])
                ),
            },
        };
        
    }
}

module.exports = PokedexTransformationStrategy;