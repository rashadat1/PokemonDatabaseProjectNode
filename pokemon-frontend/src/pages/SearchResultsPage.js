import Reach, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchResults from '../components/SearchResults';

// useLocation is a hook that returns information about where the app is now
// so pathname (path of URL), search (query parameters), hash (everything after # the anchor), state, key
const useQuery = () => {
    // this is a custom hook where useLocation().search returns the query string of the current URL
    // then we create a new URLSearchParams object from the query string which will have methods to work with the parameters
    return new URLSearchParams(useLocation().search);
};

//e.g. we could navigate to /search?q=bulbasaur when URLSearchParams("?q=bulbasaur")
// then useQuery().get('q') = bulbasaur

// from App.js we see this is rendered whenever we navigate to a URL with /search in the path
// which happens after submitting a form for searching
const SearchResultsPage = () => {
    const [results, setResults] = useState(null);
    const query = useQuery().get('q');

    // a useEffect will run the provided function when the component mounts or the query changes
    // so it checks if query is null. If not it proceeds to make a GET request to the URL (the backend server)
    useEffect(() => {
        if (query) {
            console.log('Sending request to server', query);
            fetch(`http://localhost:3000/api/search?q=${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // parses the response from the backend as a JSON
                return response.json();
            })
            // set results state with fetched data
            // data is parsed JSON data from the response we use this to update results to be the data from the backend
            .then(data => setResults(data))
            .catch(error => console.error('Error fetching data:', error))
        }
    }, [query]);

    return (
        // if results is not null displays the Search Results component with the results else displays the loading... text
        <div className="search-results-page">
            <h1>Search Results for "{query}"</h1>
            {results ? <SearchResults results={results} /> : <p>Loading...</p>}
        </div>
    );
};


export default SearchResultsPage;