import React from 'react';
import PropTypes from 'prop-types';

const PlayerResults = ({ showCorrect, response, isCorrect=false, correctAnswer }) => {
    let resultText = '';
    if (showCorrect) {
        resultText = isCorrect ? 'Correct!' : 'Incorrect...';
    }
    
    return (
        <>
            <nav id='nav-bar' style= {{
                height: 100,
                textAlign: 'center',
            }}>
                <h1>RESULT: {resultText}</h1>
            </nav>
            <main>
                <h4>Your Answer:</h4>
                <p>{response}</p> {/* TODO: make a margin component */}
                
                <br />

                <h4>Correct Answer:</h4>
                <p>{correctAnswer}</p>

                <br />
            </main>
        </>
    );
}
PlayerResults.propTypes = {
    showCorrect: PropTypes.bool.isRequired,
    response: PropTypes.string.isRequired,
    isCorrect: PropTypes.bool,
    correctAnswer: PropTypes.string.isRequired,
};

export default PlayerResults;