import React from 'react';
import '../App.css';
import pokemonMap from '../utils/pokemonMap.json';

const FeaturedPokemon = () => {
    const featured = [
        {id: 1, name: 'Bulbasaur', description: 'A grass/poison type pokemon and one of the Kanto region starters.'},
        {id: 2, name: 'Charmander', description: 'A fire type pokemon and one of the Kanto region starters.'},
        {id: 3, name: 'Squirtle', description: 'A water type pokemon and one of the Kanto region starters.'},
        {id: 4, name: 'Pikachu', description: 'An electric type pokemon native to the Kanto region.'}
    ];

    return (
        <div className="featured-pokemon">
            <h2>Featured Pokemon</h2>
            <div className="pokemon-grid">
                {featured.map(pokemon => (
                    <div key={pokemon.id} className="pokemon-card">
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonMap[pokemon.name.toLowerCase()]}.png`} />
                        <h4>{pokemon.name}</h4>
                        <p>{pokemon.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedPokemon;