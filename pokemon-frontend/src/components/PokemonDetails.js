import axios from "axios";
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { fetchTypeList, fetchTypeDetails } from '../utils/fetchTypeDetails';
import PokemonStats from './PokemonStats';
import PokemonMoves from "./PokemonMoves";

const PokemonDetails = () => {
    const { pokemon_name } = useParams();
    const [cleanedName, setCleanedName] = useState(null);
    const [pokemonData, setPokemonData] = useState(null);
    const [typeDetails, setTypeDetails] = useState({});
    const [pokemonSummary, setPokemonSummary] = useState(
        {
            types: [], 
            entry: null
        }
    );
    const [categorizedMoves, setCategorizedMoves] = useState({
        level_up: [],
        egg_moves: [],
        move_tutor: [],
        machine: []
    })

    useEffect(() => {
        const processNames = () => {
            try {
                const lowerCaseName = pokemon_name.toLowerCase();
                let cleanedName = lowerCaseName;

                if (lowerCaseName.includes('alolan')) {
                    cleanedName = cleanedName.replace('-','').replace('%20','').replace('alolan','').trim();
                    cleanedName =  `${cleanedName}-alola`;
                } else if (lowerCaseName.includes('galarian')) {
                    cleanedName = cleanedName.replace('-','').replace('%20','').replace('galarian','').trim();
                    cleanedName = `${cleanedName}-galar`;
                } else if (lowerCaseName.includes('hisuian')) {
                    cleanedName = cleanedName.replace('-','').replace('%20','').replace('hisuian','').trim();
                    cleanedName = `${cleanedName}-hisui`;
                };
                setCleanedName(cleanedName);

            } catch (error) {
                console.error(`Error updating pokemon_name`, error);
            }

        };
        processNames();
    },[pokemon_name]);

    useEffect(() => {
        if (!cleanedName) return;
        const fetchPokemonData = async () => {
            try {

                console.log("Sending request with pokemon_name:",cleanedName)
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${cleanedName}/`);
                setPokemonData(response.data);
                console.log("Pokemon Data JSON:",response.data)
            } catch (error) {
                console.error("Error fetching pokemon data:", error)
            }
        };
        fetchPokemonData();
    },[cleanedName]); // rerun effect when pokemon_name changes

    useEffect(() => {
        if (!cleanedName) return;
        const fetchPokemonSummary = async () => {
            try {
                console.log('Sending request to backend for summary data');
                if (!(cleanedName.includes('alola') || cleanedName.includes('galar') || cleanedName.includes('hisui'))) {
                    const response = await axios.get(`http://localhost:3000/api/pokedex/pokemonSummary?pokemon_name=${cleanedName}`);
                    setPokemonSummary(response.data);
                    console.log(response);
                } 

            } catch (error) {
                console.log('Error occurred while fetching Pokedex summary: ',error);
            }
        };
        fetchPokemonSummary();
    },[cleanedName])

    useEffect(() => {
        if (!cleanedName) return;
        // get Type sprites
        (async function fetchTypeSprites() {
            const types = await fetchTypeList();
            console.log("Types fetched:", types);

            for (const type of types) {
                console.log(type);
                try {
                    const sprite = await fetchTypeDetails(type.url);
                    console.log(sprite);

                    setTypeDetails(prev => ({ ...prev, [type.name]: sprite }));
                } catch (error) {
                    console.error(`Error fetching sprite for ${type.name}`,error);
                }
            }
        })();
    }, [cleanedName]);

    useEffect(() => {
        if (!cleanedName) return;
        const fetchPokemonMoves = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${cleanedName.toLowerCase()}/`);
                console.log('Response received from retrieving pokemon move data: ',response.data);
                const moveList = response.data.moves;
                console.log("Moves this pokemon can learn: ",moveList);

                // Filter moves that have scarlet-violet in the version group
                const filteredMoves = moveList.filter(moveData => 
                    moveData.version_group_details.some(version_details => (
                        version_details.version_group.name === "scarlet-violet"))
                );
                
                const moveInfoPromise = filteredMoves.map(async (moveData) => {
                    const moveResponse = await axios.get(moveData.move.url);
                    const moveDataResponse = moveResponse.data;

                    const versionDetail = moveData.version_group_details.find(
                        version_details => version_details.version_group.name === "scarlet-violet");
                    
                    const learn_method = versionDetail.move_learn_method.name;
                    const level_learned_at = versionDetail.level_learned_at;
                    const typeSprite = await fetchTypeDetails(moveDataResponse.type.url);

                    const descriptionEntry = moveDataResponse.effect_entries?.find(entry => entry.language.name === 'en');
                    const description = descriptionEntry ? descriptionEntry.short_effect : 'No description available';
                    
                    return {
                        name: moveDataResponse.name || '--',
                        power: moveDataResponse.power || '--',
                        accuracy: moveDataResponse.accuracy || '--',
                        pp: moveDataResponse.pp || '--',
                        type: typeSprite || 'Type Missing', 
                        description: description || 'Placeholder',
                        damageClass: moveDataResponse.damage_class.name || 'Placeholder',
                        level_learned: level_learned_at || 0,
                        method: learn_method || 'Unknown'
                    };
                });
                // wait to resolve promises for all a pokemon's learned move
                const moveInfo = await Promise.all(moveInfoPromise);
                // categorize moves based on method
                const levelUpMoves = moveInfo.filter(move => move.method === 'level-up');
                const sortedLevelUpMoves = levelUpMoves.sort((a,b) => a.level_learned - b.level_learned);

                const eggMoves = moveInfo.filter(move => move.method === 'egg');
                const moveTutorMoves = moveInfo.filter(move => move.method === 'tutor');
                const machineMoves = moveInfo.filter(move => move.method === 'machine');

                setCategorizedMoves(
                    {
                        level_up: sortedLevelUpMoves,
                        egg_moves: eggMoves,
                        move_tutor: moveTutorMoves,
                        machine: machineMoves
                    }
                );
                console.log(categorizedMoves);
                // need to call another API endpoint to get move data this just gets the list
            } catch (error) {
                console.error('Error fetching move data',error);
            }
        };
        fetchPokemonMoves(cleanedName);

    }, [cleanedName]);

    return (
        <div className="pokemon-details-container">
            {pokemonData && Object.keys(typeDetails).length > 0 && Object.keys(categorizedMoves).length > 0 ? (
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
                <PokemonMoves categorizedMoves={ categorizedMoves } />

                </>
            ) : (
                <p>Loading...</p>
                )}
        </div>
            
    );
};

export default PokemonDetails;