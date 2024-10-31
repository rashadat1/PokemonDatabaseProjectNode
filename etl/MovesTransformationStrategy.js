const axios = require('axios');
const DataBuilder = require('./DataBuilder');

class MovesTransformationStrategy {

    async transform(data) {
        let move_category = data.meta.category.name;
        let stat_change = false;
        let ailment_change = false;
        
        if ((move_category === 'damage+lower' || move_category === 'damage+raise' || move_category === 'net-good-stats')) {
            stat_change = true;
        }

        if ((move_category === 'ailment') || (move_category === 'damage+ailment')) {
            ailment_change = true;
        }
        const transformed = {
            name: data.name,
            description: data.flavor_text_entries.find(text => text.language.name === 'en')?.flavor_text || '',
            power: data.power,
            pp: data.pp,
            damage_class: data.damage_class.name,
            priority: data.priority,
            healing: data.meta.healing,
            crit_rate: data.meta.crit_rate,
            drain: data.meta.drain,
            flinch_chance: data.meta.flinch_chance,
            max_hits: data.meta.max_hits,
            min_hits: data.meta.min_hits,
            max_turns: data.meta.max_turns,
            min_turns: data.meta.min_turns,
            has_ailment: ailment_change,
            has_stat_change: stat_change
        }
    };
}

module.exports = MovesTransformationStrategy;