import React from 'react';
import PropTypes from 'prop-types';
import { FRQ, MCQ } from '../routes/player/PlayerCreate';
import { generateId } from '../util/random';

const Choice = ({ correct, statement }) => {
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
            backgroundColor: correct ? 'rgba(14, 166, 11, 0.75)' : 'gainsboro'
        }}>
            <p style={{ display: 'inline-block', color: correct ? 'white' : 'rgb(54, 54, 54)' }}>{statement}</p>
            {correct && <p style={{
                display: 'inline-block',
                marginRight: '0.5rem',
                float: 'right',
                fontSize: '1rem',
                color: 'white',
                fontStyle: 'italic',
                opacity: 0.75 }}
            >
                Correct Answer
            </p>}
        </div>
    );
};
Choice.propTypes = {
    correct: PropTypes.bool.isRequired,
    statement: PropTypes.string.isRequired,
};

const PlayerWorkBox = ({ username, questionData, answerData, responded }) => {
    // const [showing, setShowing] = React.useState('question');
    // const handleSwitch = () => {
    //     switch (showing) {
    //         case 'question':
    //             setShowing('answer');
    //             break;
    //         case 'answer':
    //             setShowing('question');
    //             break;
    //         default:
    //             setShowing('question');
    //             break;
    //     }
    // }
    
    const formAnswers = React.useCallback(() => {
        const intAnswer = parseInt(answerData);

        switch (questionData.type) {
            case MCQ:
                return questionData.answerChoices.map((choice, index) => {
                    const id = generateId();
                    return <Choice key={id} statement={choice.statement} correct={index === intAnswer} />
                });
            case FRQ:
                return <p style={{ marginBottom: '1rem', color: 'rgb(54, 54, 54)' }}>{answerData}</p>
            default:
                return null;
        }
    }, [questionData, answerData]);

    const choicesOrAnswer = formAnswers();

    return (
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
                backgroundColor: responded ? 'white' : 'rgb(235, 192, 52)',
                textAlign: 'left',
            }}
        >
            <p style={{ fontSize: '1.25rem', color: 'slategray' }}>{username}&apos;s plane</p>
            <p style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '1.75rem', color: 'rgb(54, 54, 54)' }}>Q: {questionData.statement}</p>
            {choicesOrAnswer}
        </div>
    );
}
PlayerWorkBox.propTypes = {
    username: PropTypes.string.isRequired,
    questionData: PropTypes.object.isRequired,
    answerData: PropTypes.string.isRequired,
    responded: PropTypes.bool.isRequired,
};

export default PlayerWorkBox;