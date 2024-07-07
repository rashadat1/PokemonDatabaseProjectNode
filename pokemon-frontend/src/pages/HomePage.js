import React, { useState } from 'react';
import Searchbar from '../components/Searchbar';
import SearchResults from '../components/SearchResults';

const HomePage = () => {
    const [results, setResults] = useState(null);

    const handleSearch = (query) => {
        // /api/search to indicate this is a backend route
        fetch(`/api/search?q=${query}`)
        .then(response => response.json())
        .then(data => setResults(data))
        .catch(error => console.error('Error fetching data:', error))
    };

    return (
        <div className="home-page">
            <Searchbar onSearch={handleSearch} />
            {results && <SearchResults results={results} />}
        </div>
    );
};

export default HomePage;