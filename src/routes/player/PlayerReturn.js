import React from 'react';
import PropTypes from 'prop-types';
import Corner from '../../components/Corner';
import { AiFillHeart } from 'react-icons/ai';
import '../../styles/player/PlayerReturn.scss';

const PlayerReturn = ({ likes, responses, othersResponses, handleOpenLeaderboard }) => {
    let correctResponses = responses.filter(response => response.isCorrect);
    const correctPercentage = correctResponses.length / responses.length * 100;

    console.log(othersResponses);
    let correctOtherPlayers = othersResponses.filter(response => response.isCorrect);
    const othersCorrectPercentage = correctOtherPlayers.length / othersResponses.length * 100;

    return (
        <>
            <nav id='nav-bar' style= {{
                height: 100,
                textAlign: 'center',
                justifyContent: 'center',
            }}>
                <h1>Tosses Returned!</h1>
            </nav>
            <main>
                <div id='result-paper'>
                    <div id='header-bar'>
                        <h3 id='title'>Your Summary:</h3>
                        <div id='likes-container'>
                            {/* TODO: make likes component so we don't have to reuse */}
                            <p id='likes-text'>{likes}</p>
                            <AiFillHeart fill='#ff3d51' size='2rem' />
                        </div>
                    </div>
                    <p className='detail'>
                        {correctPercentage}% ({correctResponses.length}/{responses.length}) Got your question correct.
                    </p>
                    <p className='detail'>
                        You got {othersCorrectPercentage}% ({correctOtherPlayers.length}/{othersResponses.length}) of other questions correct.
                    </p>
                    {othersResponses.map((response, index) => <Response key={index} correct={response.isCorrect} name={response.username} />)}
                </div>
            </main>
            <Corner corner='tl' className='link-box'>
                <p className='link-text' style={{ color: '#FBFBFB', margin: '-0.5rem' }} onClick={handleOpenLeaderboard}>Leaderboard</p>
            </Corner>
        </>
    );
}
PlayerReturn.propTypes = {
    likes: PropTypes.number.isRequired,
    responses: PropTypes.array.isRequired,
    othersResponses: PropTypes.array.isRequired,
    handleOpenLeaderboard: PropTypes.func.isRequired,
};

const Response = ({ correct, name }) => {
    if (correct) {
        return (
            <div className='response-container correct'>
                <span className='username'>{name}&apos;s Question</span>
                <span className='correct-text'><i>Correct</i></span>
            </div>
        );
    }
};
Response.propTypes = {
    correct: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired
};

export default PlayerReturn;