import React from 'react';
import PropTypes from 'prop-types';
import Corner from '../../components/Corner';

const OtherResponse = ({ username, isCorrect }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: 200, height: 50 }}>
            <h4 style={{ marginRight: 20 }}>{username}:</h4>
            <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
        </div>
    );
}
OtherResponse.propTypes = {
    username: PropTypes.string.isRequired,
    isCorrect: PropTypes.bool.isRequired,
};

const PlayerReturn = ({ responses, othersResponses, handleOpenLeaderboard }) => {
    let correctResponses = 0;
    for (let i = 0; i < responses.length; i++) {
        correctResponses += responses[i].isCorrect;
    }
    const correctPercentage = correctResponses / responses.length * 100;

    let correctOtherPlayers = 0;
    for (let i = 0; i < othersResponses.length; i++) {
        correctOtherPlayers += othersResponses[i].isCorrect;
    }
    const othersCorrectPercentage = correctOtherPlayers / othersResponses.length * 100;
    
    return (
        <>
            <nav id='nav-bar' style= {{
                height: 100,
                textAlign: 'center',
                justifyContent: 'center',
            }}>
                <h1>Tosses Returned!</h1>
            </nav>
            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '1.5rem' }}>
                <h3>Your Responses:</h3>
                {responses.length === 1 ?
                    <h4 style={{ marginBottom: '1.5rem' }}>Your one response was {correctResponses === 1 ? 'correct' : 'incorrect'}.</h4> :
                    <h4 style={{ marginBottom: '1.5rem' }}>Out of {responses.length} total responses, you got {correctPercentage}% of them correctly.</h4>
                }
                <br />
                <h3>Responses from Other Players:</h3>
                {othersResponses.length === 1 ?
                    <h4 style={{ marginBottom: '1.5rem' }}>The one player who responded got it {correctOtherPlayers === 1 ? 'correct' : 'incorrect'}.</h4> :
                    <h4 style={{ marginBottom: '1.5rem' }}>Out of {othersResponses.length} players who responded, {othersCorrectPercentage}% of them were correct.</h4>
                }
                {othersResponses.map((otherResponse, index) => {
                    return <OtherResponse
                        key={index}
                        username={otherResponse.username}
                        isCorrect={otherResponse.isCorrect}
                    />;
                })}
            </main>
            <Corner corner='tl' className='link-box'>
                <p className='link-text' style={{ color: '#FBFBFB', margin: '-0.5rem' }} onClick={handleOpenLeaderboard}>Leaderboard</p>
            </Corner>
        </>
    );
}
PlayerReturn.propTypes = {
    responses: PropTypes.array.isRequired,
    othersResponses: PropTypes.array.isRequired,
    handleOpenLeaderboard: PropTypes.func.isRequired,
};

export default PlayerReturn;