import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { fetchTypeDetails } from '../utils/fetchTypeDetails.mjs';

const PokemonMoves = ({ categorizedMoves }) => {

    return (
        <div>
            {categorizedMoves && Object.keys(categorizedMoves).length > 0 ? (
                <>
                    <div className="moves-container">
                        <h3>Level-Up Moves</h3>
                        {categorizedMoves.level_up.map((move, index) => (
                            <div key={index} className="move-item">
                                <div className="move-name-type">
                                    <span className="move-level">Lvl. {move.level_learned}</span>
                                    <span className="move-name">{move.name}</span>
                                    <span className="move-type">
                                        <img src={move.type} alt={move.type} style={{ width: '50px', height: '20px' }} />
                                    </span>
                                </div>
                                <div className="move-details">
                                    <div className="move-detail-item"><strong>Power:</strong> {move.power || '--'}</div>
                                    <div className="move-detail-item"><strong>Accuracy:</strong> {move.accuracy !== null ? `${move.accuracy}` : '--'}</div>
                                    <div className="move-detail-item"><strong>PP:</strong> {move.pp}</div>
                                    <div className="move-detail-item"><strong>Description:</strong> {move.description}</div>
                                </div>
                            </div>
                            
                        ))}
                    </div>
                </>
        ) : (
            <p>...Loading</p>
        )}
    </div>   
    )

}

export default PokemonMoves;