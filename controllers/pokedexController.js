const db = require('../connections.db');

const filterPokedex = async (req, res) => {
    const { q } = req.query;
    const queryLength = q ? q.length : 0;
    let response = {};
    
    if (queryLength === 0) {
        // show all pokemon but join their abilities so we can see all pokemon with their game info
        const pokemonResults = await db.query(
            `SELECT 
                p.name AS Pokemon_Name,
                p.type,
                STRING_AGG(DISTINCT a.name, ', ') AS Abilities,
                p.hp,
                p.atk,
                p.def_val,
                p.spatk,
                p.spdef,
                p.spd,
                (p.hp + p.atk + p.def_val + p.spatk + p.spdef + p.spd) AS bst
            FROM 
                Pokedex p
            LEFT JOIN
                pokemon_abilities pa ON pa.pokemon_id = p.id
            LEFT JOIN
                abilities a ON pa.ability_id = a.id
            GROUP BY
                p.name, p.type, p.hp, p.atk, p.def_val, p.spatk, p.spdef, p.spd
            ORDER BY
                p.name`
            );
        response = { pokemon: pokemonResults.rows };

    } else if (queryLength <= 2) {
        // select all pokemon whose names start with these two letters in the search bar 
        const pokemonResults = await db.query(
            `SELECT
                p.name AS Pokemon_name,
                p.type,
                STRING_AGG(DISTINCT a.name, ', ') AS Abilities,
                p.hp,
                p.atk,
                p.def_val,
                p.spatk,
                p.spdef,
                p.spd,
                (p.hp + p.atk + p.def_val + p.spatk + p.spdef + p.spd) AS bst
            FROM
                Pokedex p
            LEFT JOIN
                pokemon_abilities pa ON pa.pokemon_id = p.id
            LEFT JOIN
                abilities a ON a.id = pa.ability_id
            WHERE
                p.name ILIKE $1
            GROUP BY
                p.name, p.type, p.hp, p.atk, p.def_val, p.spatk, p.spdef, p.spd
            ORDER BY
                p.name`,[`${q}%`]);

    } else if (queryLength > 2) {
        // for 3 or more letters we will also search moves and abilities
        // ILIKE is used so it is case-insensitive
        // this search is to see if the typed text matches exactly with a type, move, or ability
        const exactMatchResults = await Promise.all(
            db.query(`SELECT type_name FROM types WHERE type_name ILIKE $1`,[q]),
            db.query(`SELECT name FROM moves WHERE name ILIKE $1`,[q]),
            db.query(`SELECT name FROM abilities WHERE name ILIKE $1`,[q])
        )
        const [typeMatch, moveMatch, abilityMatch] = exactMatchResults.map(result => result.rows[0]);
        // if there is a type match, filter to show only pokemon with this type
        if (typeMatch) {
            const pokemonResults = await db.query(
                `SELECT
                    p.name AS Pokemon_name,
                    p.type,
                    STRING_AGG(DISTINCT a.name, ', ') AS Abilities,
                    p.hp,
                    p.atk,
                    p.def_val,
                    p.spatk,
                    p.spdef,
                    p.spd,
                    (p.hp + p.atk + p.def_val + p.spatk + p.spdef + p.spd) AS bst
                FROM
                    Pokedex p
                LEFT JOIN
                    pokemon_abilities pa ON pa.pokemon_id = p.id
                LEFT JOIN
                    abilities a ON a.id = pa.ability_id
                WHERE
                    $1 ILIKE ANY(p.type)
                GROUP BY
                    p.name, p.type, p.hp, p.atk, p.def_val, p.spatk, p.spdef, p.spd
                ORDER BY
                    p.name`,[q]);
            
            const typeResults = await db.query(
                `SELECT
                    type_name
                FROM
                    types t
                WHERE
                    t.type_name ILIKE $1`,[q]);
            
            const moveResults = await db.query(
                `SELECT
                    m.name,
                    m.element,
                    m.category,
                    m.power,
                    m.accuracy,
                    m.pp
                FROM
                    moves m
                WHERE
                    m.name ILIKE $1`,[`%${q}%`]);

            const abilityResults = await db.query(
                `SELECT
                    a.name,
                    a.description
                FROM
                    abilities a
                WHERE
                    a.name ILIKE $1`,[`%${q}%`]);
            

        } else if (moveMatch) {
            // if we have a move match let's filter to just show the pokemon that
            // can learn this move there will be two results arrays in this case 
            const pokemonResultsLevel = await db.query(
                `SELECT DISTINCT
                    p.name,
                    p.type,
                    STRING_AGG(DISTINCT a.name, ', ') as abilities,
                    p.hp,
                    p.atk,
                    p.def_val,
                    p.spatk,
                    p.spdef,
                    p.spd,
                    (p.hp + p.atk + p.def_val + p.spatk + p.spdef + p.spd) AS bst,
                    lbl.level_learned
                FROM 
                    pokedex p
                LEFT JOIN
                    pokemon_abilities pa ON p.id = pa.pokemon_id
                LEFT JOIN
                    learned_by_leveling lbl on lbl.pokemon_id = p.id
                LEFT JOIN
                    abilities a ON a.id = pa.ability_id
                LEFT JOIN
                    moves m on m.move_id = lbl.move_id
                WHERE
                    m.name ILIKE $1
                GROUP BY
                    p.name, p.type, p.hp, p.atk, p.def_val, p.spatk, p.spdef, p.spd, lbl.level_learned
                ORDER BY
                    p.name`,[q]);

            const pokemonResultsTM = await db.query(
                `SELECT DISTINCT
                    p.name,
                    p.type,
                    STRING_AGG(DISTINCT a.name, ', ') as abilities,
                    p.hp,
                    p.atk,
                    p.def_val,
                    p.spatk,
                    p.spdef,
                    p.spd,
                    (p.hp + p.atk + p.def_val + p.spatk + p.spdef + p.spd) AS bst,
                FROM 
                    pokedex p
                LEFT JOIN
                    pokemon_abilities pa ON pa.pokemon_id = p.id
                LEFT JOIN
                    learned_by_tm lbt on lbt.pokemon_id = p.id
                LEFT JOIN
                    moves m on m.move_id = lbt.move_id
                LEFT JOIN
                    abilities a ON a.id = pa.ability_id
                WHERE
                    m.name ILIKE $1
                GROUP BY
                    p.name, p.type, p.hp, p.atk, p.def_val, p.spatk, p.spdef, p.spd
                ORDER BY
                    p.name`,[q]);
            
            const typeResults = await db.query(
                `SELECT
                    type_name
                FROM
                    types t
                WHERE
                    t.type_name ILIKE $1`,[`%${q}%`]);
                    
            const moveResults = await db.query(
                `SELECT
                    m.name,
                    m.element,
                    m.category,
                    m.power,
                    m.accuracy,
                    m.pp
                FROM
                    moves m
                WHERE
                    m.name ILIKE $1`,[`%${q}%`]);

            const abilityResults = await db.query(
                `SELECT
                    a.name,
                    a.description
                FROM
                    abilities a
                WHERE
                    a.name ILIKE $1`,[`%${q}%`]);
                    
        } else if (abilityMatch) {

        }
    }
}