import React from 'react'

const PokemonStats = ({ stats }) => {
    const maxStatValue = 255;
    // colors for each stat bar
    const statColors = {
        hp: "#FF5959",
        attack: "#F5AC78",
        defense: "#FAE078",
        "special-attack": "#9DB7F5",
        "special-defense": "#A7DB8D",
        speed: "#FA92B2",
    };

    return (
        <div className="stats-container">
            <h3>Base Stats</h3>
            {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                    <div className="stat-name">
                        {stat.stat.name.replace(/-/g,' ').toUpperCase()}: {stat.base_stat}
                    </div>
                    <div className="stat-bar-container">
                        <div
                            className="stat-bar"
                            style={{
                                width: `${(stat.base_stat / maxStatValue) * 100}%`,
                                backgroundColor: statColors[stat.stat.name] || "#ddd",
                            }}
                        ></div>
                    </div>
                </div>
                ))}
            </div>
        );
};

export default PokemonStats;