import React from 'react';
import PropTypes from 'prop-types';

const ReturnedResponse = ({ username, isCorrect }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: 200, height: 50 }}>
            <h3 style={{ marginRight: 20 }}>{username}:</h3>
            <h3>{isCorrect ? 'Correct' : 'Incorrect'}</h3>
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
                <h1>TOSSES RETURNED:</h1>
            </nav>
            <main>
                {returnedResponses.length === 1 ?
                    <h2>The 1 player who responded got it {correctPlayers === 1 ? 'correct' : 'incorrect'}.</h2> :
                    <h2>Out of {returnedResponses.length} players who responded, {correctPercentage}% of them were correct.</h2>
                }
                <br />
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