import React from 'react';
import PropTypes from 'prop-types';

const ReturnedResponse = ({ username, isCorrect }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: 200, height: 50 }}>
            <h4 style={{ marginRight: 20 }}>{username}:</h4>
            <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
        </div>
    );
}
ReturnedResponse.propTypes = {
    username: PropTypes.string.isRequired,
    isCorrect: PropTypes.bool.isRequired,
};

const PlayerReturn = ({ returnedResponses }) => {
    let correctPlayers = 0;
    for (let i = 0; i < returnedResponses.length; i++) {
        correctPlayers += returnedResponses[i].isCorrect;
    }
    const correctPercentage = correctPlayers / returnedResponses.length * 100; // TODO
    
    return (
        <>
            <nav id='nav-bar' style= {{
                height: 100,
                textAlign: 'center',
            }}>
                <h1>Tosses Returned!</h1>
            </nav>
            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '1.5rem' }}>
                {returnedResponses.length === 1 ?
                    <h4 style={{ marginBottom: '1.5rem' }}>The 1 player who responded got it {correctPlayers === 1 ? 'correct' : 'incorrect'}.</h4> :
                    <h4 style={{ marginBottom: '1.5rem' }}>Out of {returnedResponses.length} players who responded, {correctPercentage}% of them were correct.</h4>
                }
                <h3>Player Responses:</h3>
                {returnedResponses.map((returnedResponse, index) => {
                    return <ReturnedResponse
                        key={index}
                        username={returnedResponse.username}
                        isCorrect={returnedResponse.isCorrect}
                    />;
                })}
            </main>
        </>
    );
}
PlayerReturn.propTypes = {
    returnedResponses: PropTypes.array.isRequired,
};

export default PlayerReturn;