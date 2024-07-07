const { Pool } = require('pg');

// instantiate a pool object to manage the connection to our database of pokemon
const pool = new Pool({
    user: 'postgres',
    password: 'PostGresSenpai',
    host: 'localhost',
    port: '5431',
    database: 'pokemondb'
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log("Database connection established successfully");
        release();
    }
});


module.exports = {
    query: (text, params) => pool.query(text, params)

};
// exports an object with a query method. When imported we can use 'query'
// to execute SQL queries against the database using the 'Pool' instance