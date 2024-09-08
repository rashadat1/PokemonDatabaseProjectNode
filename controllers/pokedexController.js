const db = require('../connections/db');

const filterPokedex = async (req, res) => {
    const { q } = req.query;
    const queryLength = q ? q.length : 0;
    console.log('Received query:',q);
    let response = {
        pokemon: [],
        moves: [],
        abilities: [],
        types: [],
        typeMatch: null,
        abilityMatch: null,
        moveMatch: null,
    };
    
    
    // show all pokemon and join their abilities so we can see all pokemon with their game info
    const baseQuery = 
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
            abilities a ON pa.ability_id = a.id`;
    
    // if the length of the query is <= 2 then we should append the query to search for
    // pokemon starting with these letters
    let whereClause = '';
    let queryParams = [];
    let havingClause = '';
    let additionalJoins = '';
    // for queryLength 1 or 2 we filter pokemon to just show pokemon whose names begin with
    // the letters in the queryParams 
    if (queryLength === 1 || queryLength === 2) {

        whereClause = `WHERE p.name ILIKE $1`;
        queryParams = [`${q}%`];
    
    // if the query has length at least 3 we start to look for exact matches in types, moves, and abilities
    } else if (queryLength > 2) {
        const exactMatchResults = await Promise.all([
            db.query(`SELECT type_name FROM types WHERE type_name ILIKE $1`,[q]),
            db.query(`SELECT name FROM moves WHERE name ILIKE $1`,[q]),
            db.query(`SELECT name FROM abilities WHERE name ILIKE $1`,[q])
        ]);

        const [typeMatch, moveMatch, abilityMatch] = exactMatchResults.map(result => result.rows[0]);

        if (typeMatch) {
            whereClause = `WHERE $1 ILIKE ANY(p.type)`
            queryParams = [q];
            response.typeMatch = typeMatch.type_name;

        } else if (moveMatch) {
            additionalJoins =
                `LEFT JOIN
                    learned_by_leveling lbl ON lbl.pokemon_id = p.id
                LEFT JOIN
                    learned_by_tm lbt ON lbt.pokemon_id = p.id
                LEFT JOIN
                    moves m on m.move_id = lbl.move_id OR m.move_id = lbt.move_id`;
            whereClause = `WHERE m.name ILIKE $1`;
            queryParams = [q];
            response.moveMatch = moveMatch.name;

        } else if (abilityMatch) {
            havingClause = 
                `HAVING
                    BOOL_OR(a.name ILIKE $1) = TRUE`;
            queryParams = [q];
            response.abilityMatch = abilityMatch.name;

        } else {
            whereClause = `WHERE p.name ILIKE $1`;
            queryParams = [`${q}%`]
        }
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
                a.description,
                a.num_holders
            FROM
                abilities a
            WHERE
                a.name ILIKE $1`,[`%${q}%`]);
            
        const typeResults = await db.query(`SELECT type_name FROM types WHERE type_name ILIKE $1`,[`%${q}%`]);

        response.moves = moveResults.rows;
        response.abilities = abilityResults.rows;
        response.types = typeResults.rows;
    }

    const query = 
        `${baseQuery}
        ${additionalJoins}
        ${whereClause}
        GROUP BY
            p.name, p.type, p.hp, p.atk, p.def_val, p.spatk, p.spdef, p.spd
        ${havingClause}
        ORDER BY
            p.name`;

    const pokemonResults = await db.query(query, queryParams);
    response.pokemon = pokemonResults.rows;
    console.log(response);
    return res.json(response);
}

module.exports = { filterPokedex };