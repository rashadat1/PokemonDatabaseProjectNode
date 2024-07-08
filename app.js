const express = require('express');
const bodyParser = require('body-parser');
const IndexRoute = require('./routes/index');
const PokemonRouter = require('./routes/pokemon');
const postgreSQLDB = require('./connections/db');
const SearchRouter = require('./routes/search');
const NewsRouter = require('./routes/news');
const cors = require('cors');

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

// routing
app.use('/',IndexRoute);
app.use('/api/search',SearchRouter);
app.use('/api/news',NewsRouter);

const PORT = 3000;
// Start server and listen on port 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});