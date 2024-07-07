import Reach, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchResults from '../components/SearchResults';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SearchResultsPage = () => {
    const [results, setResults] = useState(null);
    const query = useQuery().get('q');

    useEffect(() => {
        if (query) {
            console.log('Sending request to server', query);
            fetch(`http://localhost:3000/api/search?q=${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setResults(data))
            .catch(error => console.error('Error fetching data:', error))
        }
    }, [query]);

    return (
        <div className="search-results-page">
            <h1>Search Results for "{query}"</h1>
            {results ? <SearchResults results={results} /> : <p>Loading...</p>}
        </div>
    );
};


export default SearchResultsPage;