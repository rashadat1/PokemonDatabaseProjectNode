import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { fetchTypeList, fetchTypeDetails } from '../utils/fetchTypeDetails';
import pokemonMap from '../utils/pokemonMap.json';
import '../App.css';

const getSpriteURL = (pokemonName) => {
    const lowerCaseName = pokemonName.toLowerCase()
    var cleaned = lowerCaseName.replace(' ','-');
    cleaned = cleaned.replace('.','');
    if (lowerCaseName.includes('alolan')) {
        console.log(lowerCaseName);
        console.log(lowerCaseName.replace('alolan',''));
        return `https://img.pokemondb.net/sprites/scarlet-violet/icon/${cleaned.replace('alolan-','')}-alolan.png`
    }

    if (lowerCaseName.includes('galarian')) {
        return `https://img.pokemondb.net/sprites/scarlet-violet/icon/${cleaned.replace('galarian-','')}-galarian.png`
    }
    if (lowerCaseName.includes('hisuian')) {
        return `https://img.pokemondb.net/sprites/scarlet-violet/icon/${cleaned.replace('hisuian-','')}-hisuian.png`
    }

    if (lowerCaseName.includes('(blade forme)')) {
        return `https://img.pokemondb.net/sprites/scarlet-violet/icon/aegislash-blade.png`
    }
    
    if (lowerCaseName.includes('(shield forme)')) {
        return `https://img.pokemondb.net/sprites/scarlet-violet/icon/aegislash-shield.png`
    }

    return `https://img.pokemondb.net/sprites/scarlet-violet/icon/${pokemonName.toLowerCase()}.png`
    //return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${pokemonID}.png`;
};

const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const DynamicSearchBar = ({ initialQuery }) => {
    // query is a state variable to store the user Input via setQuery
    const [query, setQuery] = useState(initialQuery || '');
    // results stores search results from server side
    const [results, setResults] = useState(
        {
            pokemon: [],
            moves: [],
            abilities: [],
            types: [],
            typeMatch: null,
            abilityMatch: null,
            moveMatch: null
        });
    const [typeDetails, setTypeDetails] = useState({});
    // useEffect to trigger when the component mounts and whenever the
    // query changes
    useEffect(() => {
        const fetchResults = async () => {
            try {
                // fetch all pokemon if query empty
                const response = await axios.get(`http://localhost:3000/api/pokedex/pokeFilter?q=${query}`);
                setResults(response.data);
                console.log('Fetched results: ',response.data);
            } catch (error) {
                console.log('Error fetching search results:',error);
            }
        };
        fetchResults();
    },[query]);

    useEffect(() => {
        fetchTypeList().then(types => {
            types.forEach(async type => {
                const sprite = await fetchTypeDetails(type.url);
                setTypeDetails(prev => ({ ...prev, [type.name]: sprite}));
            });
        })
        console.log(typeDetails);
    }, []);



    // prevent Default prevents default form submission
    return (
        <div>
            <form onSubmit={(e) => e.preventDefault()} className="search-bar-dynamic">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    // update query on input change
                    placeholder='Search Pokemon by moves, abilities, types...'
                />
            </form>

            {/* Display results under the search bar */}
            <div className="search-results-dynamic">
                {/* Types Section */}
                {results.types.length > 0 && (
                    <div className="results-table">
                        <h3>Types</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.types.map((type,index) => (
                                    <tr key={index}>
                                        <td>{capitalizeString(type.type_name)}</td>
                                        <td>
                                            <img
                                                src={typeDetails[type.type_name]}
                                                alt={type.Name}
                                                style={{ width: '64px', height: '20px'}}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Moves Section */}
                {results.moves.length > 0 && (
                    <div className="results-table">
                        <h3>Moves</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Category</th>
                                    <th>Power</th>
                                    <th>Accuracy</th>
                                    <th>PP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.moves.map((move,index) => (
                                    <tr key={index}>
                                        <td>{move.name}</td>
                                        <td>
                                            <img
                                                src={typeDetails[move.element.toLowerCase()]}
                                                alt={move.element}
                                                style={{ width: '64px', height: '20px'}}
                                            />
                                        </td>
                                        <td>{move.category}</td>
                                        <td>{move.power}</td>
                                        <td>{move.accuracy}</td>
                                        <td>{move.pp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Abilities Section */}
                {results.abilities.length > 0 && (
                    <div className="results-table">
                        <h3>Abilities</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.abilities.map((ability,index) => (
                                    <tr key={index}>
                                        <td>{ability.name}</td>
                                        <td>{ability.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Pokemon Section */}
                {results.pokemon.length > 0 && (
                    <div className="results-table">
                        {results.typeMatch && (
                            <h3>{capitalizeString(results.typeMatch)} Type Pokemon</h3>
                        )}
                        {results.abilityMatch && (
                            <h3>Pokemon with {capitalizeString(results.abilityMatch)}</h3>
                        )}
                        {results.moveMatch && (
                            <h3>Pokemon that can learn {capitalizeString(results.moveMatch)}</h3>
                        )}
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Abilities</th>
                                    <th>HP</th>
                                    <th>ATK</th>
                                    <th>DEF</th>
                                    <th>SPATK</th>
                                    <th>SPDEF</th>
                                    <th>SPD</th>
                                    <th>BST</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.pokemon.map((pokemon,index) => (
                                    <tr key={index}>
                                        <td>
                                            <img
                                                src={getSpriteURL(pokemon.pokemon_name)}
                                                alt={pokemon.pokemon_name}
                                                style={{ width: '64px', height: '64px'}}
                                            />
                                        </td>
                                        <td>{pokemon.pokemon_name}</td>
                                        <td>{pokemon.type.map((type, index) => (
                                            <img
                                                key={index}
                                                src={typeDetails[type.toLowerCase()]}
                                                alt={type}
                                                style={{ width: '64px', height: '20px' }}
                                            />
                                        ))}</td>
                                        <td>{pokemon.abilities}</td>
                                        <td>{pokemon.hp}</td>
                                        <td>{pokemon.atk}</td>
                                        <td>{pokemon.def_val}</td>
                                        <td>{pokemon.spatk}</td>
                                        <td>{pokemon.spdef}</td>
                                        <td>{pokemon.spd}</td>
                                        <td>{pokemon.bst}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div> 


        </div>
    
    )
}

export default DynamicSearchBar;