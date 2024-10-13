import axios from "axios";
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { fetchTypeList, fetchTypeDetails } from '../utils/fetchTypeDetails';
import PokemonStats from './PokemonStats';

const PokemonDetails = () => {
    const { pokemon_name } = useParams();
    const [pokemonData, setPokemonData] = useState(null);
    const [typeDetails, setTypeDetails] = useState({});
    const [pokemonSummary, setPokemonSummary] = useState(
        {
            types: [], 
            entry: null
        }
    );

    useEffect(() => {
        const fetchPokemonData = async () => {
            try {
                console.log("Sending request with pokemon_name:",pokemon_name)
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon_name}/`);
                setPokemonData(response.data);
                console.log("Pokemon Data JSON:",response.data)
            } catch (error) {
                console.error("Error fetching pokemon data:", error)
            }
        };
        fetchPokemonData();
    },[pokemon_name]); // rerun effect when pokemon_name changes

    useEffect(() => {
        const fetchPokemonSummary = async () => {
            try {
                console.log('Sending request to backend for summary data');
                const response = await axios.get(`http://localhost:3000/api/pokedex/pokemonSummary?pokemon_name=${pokemon_name}`);
                setPokemonSummary(response.data);
                console.log(response);
            } catch (error) {
                console.log('Error occurred while fetching Pokedex summary: ',error);
            }
        };
        fetchPokemonSummary();
    },[pokemon_name])

    useEffect(() => {
        // get Type sprites
        fetchTypeList().then(types => {
            types.forEach(async type => {
                const sprite = await fetchTypeDetails(type.url);
                console.log(`Fetched sprite for ${type.name}: `, sprite);
                setTypeDetails(prev => ({ ...prev, [type.name]: sprite }));
            });
        console.log('Type sprite URLs successfully retrieves: ',typeDetails);
        })
    }, []);

    return (
        <div className="pokemon-details-container">
            {pokemonData && Object.keys(typeDetails).length > 0 ? (
                <>
                    <div className="pokemon-basic-summary-container">
                        <h1 className="pokemon-name">{"No." + pokemonData.id + ' ' + pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h1>
                        <div className="pokemon-summary">
                            <div className="pokemon-image-container">
                                <img className="pokemon-image" src={pokemonData.sprites.front_default} alt={pokemonData.name}/>
                                <button className="play-cry-button">Play Cry</button>
                            </div>
                            <div className="pokemon-info">
                                <p><strong>Type:</strong>{pokemonSummary.types.map((type, index) => (
                                    <img 
                                        key={index}
                                        src={typeDetails[type.toLowerCase()]}
                                        alt={type}
                                        style={{ width: '50px', height: '20px'}}
                                    />
                                ))}</p>
                                <p><strong>Entry:</strong>{' ' + pokemonSummary.entry}</p>
                                <p><strong>Height:</strong>{' ' + pokemonData.height / 10 + ' m'}</p>
                                <p><strong>Weight:</strong>{' ' + pokemonData.weight / 10 + ' kg'}</p>
                                <p><strong>Abilities:</strong>{' ' + pokemonData.abilities.map(ability => ability.ability.name.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')).join(' / ')}</p>
                                <p><strong>Held Items:</strong>{pokemonData.held_items.length > 0 ? ' ' + pokemonData.held_items.map(item => item.item.name.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')).join(' / '): " None"}</p>
                                <p><strong>Base Experience:</strong>{' ' + pokemonData.base_experience}</p>
                                <p><strong>EV Yield:</strong>{pokemonData.stats.map(stat => stat.effort !== 0 ? ' +' + stat.effort + ' ' + stat.stat.name.split(/[-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "").join('')}</p>
                            </div>
                        </div>
                    </div>
                <PokemonStats stats={pokemonData.stats} />

                </>
            ) : (
                <p>Loading...</p>
                )}
        </div>
            
    );
};

export default PokemonDetails;