import React from 'react';
import PropTypes from 'prop-types';
import { FRQ, MCQ } from './PlayerCreate';
import { generateId } from '../../util/random';

const Choice = ({ type, highlight, statement, isCorrect=false }) => {
    return (
        <div style={{
            width: '100%',
            height: 'auto',
            boxSizing: 'border-box',
            padding: '1rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            marginBottom: '1rem',
            fontSize: '1.25rem',
            backgroundColor: highlight
            ? type === 'answer'
                ? 'rgba(14, 166, 11, 0.75)'
                    : isCorrect
                        ? 'rgba(14, 166, 11, 0.75)'
                            : 'rgba(207, 27, 51, 0.75)'
                                : 'gainsboro'
        }}>
            <p style={{ display: 'inline-block', color: highlight ? 'white' : 'rgb(54, 54, 54)' }}>{statement}</p>
            {highlight && <p style={{
                display: 'inline-block',
                marginRight: '0.5rem',
                float: 'right',
                fontSize: '1rem',
                color: 'white',
                fontStyle: 'italic',
                opacity: 0.75 }}
            >
                {type === 'answer' ? 'Correct Answer' : 'Your Answer'}
            </p>}
        </div>
    );
};
Choice.propTypes = {
    type: PropTypes.oneOf(['answer', 'response']).isRequired,
    highlight: PropTypes.bool,
    statement: PropTypes.string.isRequired,
    isCorrect: PropTypes.bool,
    correctAnswer: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

const Answer = ({ response, isCorrect, questionData, correctAnswer }) => {
    const formChoices = React.useCallback((type) => {
        switch (type) {
            case 'answer':
                return questionData.answerChoices.map((choice, index) => {
                    const id = generateId();
                    return <Choice key={id} type='answer' statement={choice.statement} highlight={index === correctAnswer.index} />
                });
            case 'response':
                return questionData.answerChoices.map((choice, index) => {
                    const id = generateId();
                    return <Choice key={id} type='response' statement={choice.statement} highlight={index === response} isCorrect={isCorrect} />
                });
            default:
            return questionData.answerChoices.map((choice, index) => {
                    const id = generateId();
                    return <Choice key={id} type='answer' statement={choice.statement} highlight={index === correctAnswer.index} />
                });
        }
    }, [response, isCorrect, questionData, correctAnswer]);

    const answer = formChoices('answer');
    const self = formChoices('response');

    switch (questionData.type) {
        case FRQ:
            return null; // TODO: add
        case MCQ:
            return (
                <>
                    <div 
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '35rem',
                            height: 'fit-content',
                            boxSizing: 'border-box',
                            margin: '1.5rem',
                            padding: '1.5rem',
                            paddingTop: '1rem',
                            paddingBottom: '0.5rem',
                            backgroundColor: 'white',
                        }}
                    >
                        <p style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '1.75rem', color: 'rgb(54, 54, 54)' }}>Q: {questionData.statement}</p>
                        {answer}
                    </div>
                    <div 
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: '35rem',
                        height: 'fit-content',
                        boxSizing: 'border-box',
                        margin: '1.5rem',
                        padding: '1.5rem',
                        paddingTop: '1rem',
                        paddingBottom: '0.5rem',
                        backgroundColor: 'white',
                    }}
                >
                    <p style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '1.75rem', color: 'rgb(54, 54, 54)' }}>Q: {questionData.statement}</p>
                    {self}
                </div>
            </>
            );
        default:
            return null;
    }
};
Answer.propTypes = {
    response: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isCorrect: PropTypes.bool,
    questionData: PropTypes.object.isRequired,
    correctAnswer: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

const PlayerResult = ({ showCorrect, response, isCorrect=false, questionData, correctAnswer }) => {
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
                <h1>Result: {resultText}</h1>
            </nav>
            <main>
                <Answer response={parseInt(response)} isCorrect={isCorrect} questionData={questionData} correctAnswer={correctAnswer} />
            </main>
        </>
    );
}
PlayerResult.propTypes = {
    showCorrect: PropTypes.bool.isRequired,
    response: PropTypes.string.isRequired,
    isCorrect: PropTypes.bool,
    questionData: PropTypes.object.isRequired,
    correctAnswer: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
};

export default PlayerResult;