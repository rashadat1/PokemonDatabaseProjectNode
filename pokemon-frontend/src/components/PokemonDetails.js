import axios from "axios";
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { fetchTypeList, fetchTypeDetails } from '../utils/fetchTypeDetails';

const PokemonDetails = () => {
    const { pokemon_name } = useParams();
    const [pokemonData, setPokemonData] = useState(null);
    const [typeDetails, setTypeDetails] = useState({});

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
        // get Type sprites
        fetchTypeList().then(types => {
            types.forEach(async type => {
                const sprite = await fetchTypeDetails(type.url);
                setTypeDetails(prev => ({ ...prev, [type.name]: sprite }));
            });
        })
        console.log(typeDetails);
    }, []);

    return (
        <div className="pokemon-details-container">
            {pokemonData ? (
                <>
                    <div className="pokemon-basic-summary-container">
                        <h1 className="pokemon-name">{"No." + pokemonData.id + ' ' + pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h1>
                        <div className="pokemon-image-container">
                            <img className="pokemon-image" src={pokemonData.sprites.front_default} alt={pokemonData.name}/>
                            <button className="play-cry-button">Play Cry</button>
                        </div>
                        <div className="pokemon-info">
                            <p><strong>Type:</strong></p>
                            <p><strong>Entry:</strong></p>
                            <p><strong>Height:</strong>{' ' + pokemonData.height}</p>
                            <p><strong>Weight:</strong>{' ' + pokemonData.weight}</p>
                            <p><strong>Abilities:</strong></p>
                            <p><strong>Held Items:</strong></p>
                            <p><strong>Base Experience:</strong>{' ' + pokemonData.base_experience}</p>
                            <p><strong>EV Yield:</strong></p>

                        </div>
                    </div>


                </>
            ) : (
                <p>Loading...</p>
                )}
        </div>
            
    );
};

export default PokemonDetails;