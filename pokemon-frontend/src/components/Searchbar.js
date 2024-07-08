import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// useNavigate is a react hook for managing and navigation and routing history
// history.push adds new entry to the history stack

const Searchbar = ({ onSearch }) => {
    // query is a state variable to store user input. setQuery is a function
    // to update the query state 
    // instead of reloading we navigate to a new URL
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    // the behavior called when form is submitted
    const handleSearch = (e) => {
        // default page behavior is a full-page refresh
        // when the form is submitted
        e.preventDefault();
        navigate(`/search?q=${query}`);
    };

    return (
        // creates a form with am input field and a button
        // a search bar where form submission triggers handlesearch (navigation to search results)
        <form onSubmit={handleSearch} className="search-bar">
            <input
                // the input field expects text
                type="text"
                value={query}
                // input handler triggered when typing occurs in the field
                // hence this sets the query state variable to the current value of the input field
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for information about Pokemon, moves, abilities, regions..."
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default Searchbar;

// in more detail when an event occurs the browser creates an event object
// the target property refers to the DOM element that triggered the event 
// here it is the input element where the user is typing

// when user types into search bar the onChange even is fired and an event object
// is created that has a property e.target pointing to the input element
// e.target.value contains the current value of the input field and 
// the setQuery(e.target.values) updates the state with this current value