import React from 'react';
import '../App.css';
import pokemonMap from '../utils/pokemonMap.json';

const SearchResults = ({ results }) => {
    return (
        <div className="search-results">
            <h2>Search Results</h2>

            <h3>Pokemon</h3>
            <div className="pokemon-list">
                {results.pokemon?.map((pokemon) => (
                    <div className="pokemon-card" key={pokemon.id}>
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonMap[pokemon.name.toLowerCase()]}.png`}/>
                        <span>{pokemon.name}</span>
                    </div>
                ))}
            </div>

            <h3>Moves</h3>
            <div className="moves-list">
                {results.moves?.map((move) => (
                    <div className="move-card" key={move.move_id}>
                        <span>{move.name}</span>
                    </div>
                ))}
            </div>

            <h3>Abilities</h3>
            <div className="abilities-list">
                {results.abilities?.map((abilities) => (
                    <div className="ability-card" key={abilities.id}>
                        <span>{abilities.name}</span>
                    </div>
                ))}
            </div>

            <h3>Regions</h3>
            <div className="regions-list">
                {results.regions?.map((regions) => (
                    <div className="region-card" key={regions.region_id}>
                        <span>{regions.region_name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;