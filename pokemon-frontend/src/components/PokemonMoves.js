import React, { useEffect, useState } from 'react'
import axios from 'axios';

const PokemonMoves = (pokemon_name) => {
    const [categorizedMoves, setCategorizedMoves] = useState({
        level_up: [],
        egg_moves: [],
        move_tutor: [],
        machine: []
    })

    useEffect(() => {
        const fetchPokemonMoves = async (pokemon_name) => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon_name}/`);
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

                    return {
                        name: moveDataResponse.name,
                        power: moveDataResponse.power,
                        accuracy: moveDataResponse.accuracy,
                        pp: moveDataResponse.pp,
                        type: moveDataResponse.url,
                        description: moveDataResponse.effect_entries.short_effect,
                        damageClass: moveDataResponse.damage_class.name,
                        level_learned: level_learned_at,
                        method: learn_method
                    };
                });
                // wait to resolve promises for all a pokemon's learned move
                const moveInfo = await Promise.all(moveInfoPromise);
                
                // categorize moves based on method
                const levelUpMoves = moveInfo.filter(move => move.method === 'level-up');
                const eggMoves = moveInfo.filter(move => move.method === 'egg');
                const moveTutorMoves = moveInfo.filter(move => move.method === 'tutor');
                const machineMoves = moveInfo.filter(move => move.method === 'machine');

                setCategorizedMoves(
                    {
                        level_up: levelUpMoves,
                        egg_moves: eggMoves,
                        move_tutor: moveTutorMoves,
                        machine: machineMoves
                    }
                );
                // need to call another API endpoint to get move data this just gets the list
            } catch (error) {
                console.error('Error fetching move data',error);
            }
        };
        fetchPokemonMoves(pokemon_name);

    }, [pokemon_name]);
    return (
        <div>PokemonMoves</div>
    )
}

export default PokemonMoves;