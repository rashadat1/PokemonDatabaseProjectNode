const axios = require('axios');
const DataBuilder = require('./DataBuilder');

class MovesTransformationStrategy {
    constructor(pool) {
        this.pool = pool;
    }
    // Methods to get ids for types, learnMethods, and ailments for insertion into junction tables
    async getTypeId(typeName) {
        const result = await this.pool.query(`SELECT id FROM types WHERE type_name ILIKE $1`, [typeName]);
        return result.rows[0]?.id;
    }

    async getLearnMethodId(methodName) {
        const result = await this.pool.query(`SELECT id FROM learn_methods WHERE method_name ILIKE $1`, [methodName]);
        return result.rows[0]?.id;
    }
    async getAilmentId(ailmentName) {
        const result = await this.pool.query(`SELECT id FROM ailments WHERE name ILIKE $1`, [ailmentName]);
        return result.rows[0]?.id;
    }
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
            id: data.id,
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
            target: data.target.name,
            has_ailment: ailment_change,
            has_stat_change: stat_change
        };
        // create move_types, move_ailments, and move_stat_change tables
        const moveTypes = [];
        if (data.type) {
            const typeId = await this.getTypeId(data.type.name);
            if (typeId) {
                moveTypes.push({
                    move_id: data.id,
                    type_id: typeId
                });
            }
        }
        // if a move is either of type - ailment or damage+ailment we want to store it in this table
        const moveAilments = [];
        if (ailment_change && data.meta.ailment.name !== 'none') {
            let ailmentName = data.meta.ailment.name;
            let ailmentChance = 0;

            if (data.name === 'toxic' || data.name === 'poison-fang') {
                ailmentName = 'badly poisoned';
            }
            const ailmentId = await this.getAilmentId(ailmentName);
            if (move_category === 'ailment') {
                ailmentChance = 100;
            } else {
                ailmentChance = data.meta.ailment_chance;
            }

            if (ailmentId) {
                moveAilments.push({
                    move_id: data.id,
                    ailment_id: ailmentId,
                    ailment_chance: ailmentChance
                });
            }
        }
        // gather stat changes for move_stat_change junction table
        const moveStatChanges = [];
        /* 
        for net-good-stats moves (only cause stat changes no damage) the target determines who
        receives the stat change - difference between leer and dragon dance

        for damage+raise moves (moves that damage and increase / decrease stats of user) the sign + or -
        in the stat_changes object tells whether it is a raise or lower

        damage+lower moves contain the moves that damage the target and lower its stats
        */
        if (stat_change) {
            const moveStatChanges = data.stat_changes
                .map(stat => ({
                    move_id: data.id,
                    stat_name: stat.stat.name,
                    change: stat.change,
                    chance: data.meta.stat_chance
                }));
            moveStatChanges.push({
                move_id: data.id,
                stat_name: ,
                change: ,
                chance: 
            })
        }

    };
}

module.exports = MovesTransformationStrategy;