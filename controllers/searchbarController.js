const db = require('../connections/db');

const search = async (req, res) => {

    const query = req.query.q;
    console.log('Received query:', query);
    try {
        const [pokemonResults, movesResults, regionsResults, abilitiesResults] = await Promise.all([
            db.query('SELECT * FROM pokedex WHERE name ILIKE $1', [`%${query}%`]),
            db.query('SELECT * FROM moves WHERE name ILIKE $1', [`%${query}%`]),
            db.query('SELECT * FROM regions WHERE region_name ILIKE $1', [`%${query}%`]),
            db.query('SELECT * FROM abilities WHERE name ILIKE $1', [`%${query}%`])
        ]);
    
        const response = ({
            pokemon: pokemonResults.rows,
            moves: movesResults.rows,
            regions: regionsResults.rows,
            abilities: abilitiesResults.rows
        });

        res.json(response);

        console.log('Server response:', response);

    } catch(error) {
        console.error(error);
        res.status(500).send('Server error');
    };
};

module.exports = { search };