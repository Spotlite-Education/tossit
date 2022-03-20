import React from 'react';
import PropTypes from 'prop-types';

const ReturnedResponse = ({ username, isCorrect }) => {
    return (
        <div style={{ width: 200, height: 50, flexDirection: 'row' }}>
            <h3 style={{ marginRight: 20 }}>{username}:</h3>
            <h4>{isCorrect ? 'Correct' : 'Incorrect'}</h4>
        </div>
    );
}
ReturnedResponse.propTypes = {
    username: PropTypes.string.isRequired,
    isCorrect: PropTypes.bool.isRequired,
};

const PlayerReturn = ({ returnedResponses }) => {
    let correctPlayers = 0;
    for (let returnedResponse in returnedResponses) {
        if (returnedResponse.isCorrect) correctPlayers++;
    }
    const correctRate = correctPlayers / returnedResponses.length; // TODO
    
    return (
        <>
            <main>
                <h1>Toss Returned:</h1> {/* TODO: PUT IN NAVBAR */}
                <br /> {/* TODO: make sure this works */}
                <h2>In total, {correctPlayers} players answered correctly out of {returnedResponses.length} total questions. The correct answer rate is {correctRate}.</h2>
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