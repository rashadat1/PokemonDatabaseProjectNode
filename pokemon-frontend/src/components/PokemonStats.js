import React from 'react'

const PokemonStats = ({ stats }) => {
    const maxStatValue = 255;
    const statColors = {
        hp: "#FF5959",
        attack: "#F5AC78",
        defense: "#FAE078",
        "special-attack": "#9DB7F5",
        "special-defense": "#A7DB8D",
        speed: "#FA92B2",
    };

    return (
        <div>PokemonStats</div>
    )
}

export default PokemonStats;