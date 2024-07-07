import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// useNavigate is a react hook for managing and navigation and routing history
// history.push adds new entry to the history stack

const Searchbar = ({ onSearch }) => {
    // query is a state variable to store user input. setQuery is a function
    // to update the query state 
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?q=${query}`);
    };

    return (
        <form onSubmit={handleSearch} className="search-bar">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for information about Pokemon, moves, abilities, regions..."
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default Searchbar;