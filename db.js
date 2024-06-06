const { Pool } = require('pg');

// create instance of 'Pool' class to manage connections to our postgresql database
const pool = new Pool({
    user: 'postgres',
    password: 'PostGresSenpai',
    host: 'localhost',
    port: '5432',
    database: 'pokemondb'
});

module.exports = {
    query: (text, params) => pool.query(text, params)

};
// exports an object with a query method. When imported we can use 'query'
// to execute SQL queries against the database using the 'Pool' instance