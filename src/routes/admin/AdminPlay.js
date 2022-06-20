import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../context/socket';
import { FRQ, MCQ } from '../player/PlayerCreate';
import { generateId } from '../../util/random';

const PlayerWorkBox = ({ username, questionData, answerData }) => {
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


    /*
    
    
    TODO: make players updating work...
    Refactor playerhome more, then commit.
    Check server checkUsername.
    
    
    */

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
                backgroundColor: 'white',
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
    responses: PropTypes.array.isRequired,
};

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

const AdminPlay = ({ players }) => {
    const socket = React.useContext(SocketContext);
    const params = useParams();
    
    const [tossed, setTossed] = React.useState(false);
    const [returned, setReturned] = React.useState(false);
    
    const tossedPlayers = players.filter(player => player.toss.question);
    const canToss = tossedPlayers.length === players.length;

    return (
        <>
            <nav id='nav-bar' style={{
                height: 100,
                textAlign: 'center',
            }}>
                <h1>Planes:</h1>
            </nav>
            <main>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around'
                    }}
                >
                    {players.map((player, index) => {
                        if (player.toss.question) {
                            return <PlayerWorkBox
                                key={index}
                                username={player.username}
                                questionData={player.toss.question}
                                answerData={player.toss.answer}
                                responses={player.responses}
                            />;
                        }
                    })}
                </div>
            </main>
            <div id='footer' style={{ gap: '1.5rem', paddingTop: '1.3rem', paddingBottom: '1.3rem', opacity: canToss ? 1 : 0.5 }}>
                <button
                    className='small-button'
                    style={{ margin: 15 }}
                    onClick={() => {
                        socket.emit('tossRoom', params.roomCode);
                        setTossed(true);
                    }}
                    disabled={!canToss}
                >
                    TOSS
                </button>
                <button
                    className='small-button'
                    style={{ width: 'auto', paddingLeft: 10, paddingRight: 10, opacity: (returned || !tossed) ? 0.5 : 1 }}
                    disabled={returned || !tossed}
                    onClick={() => {
                        socket.emit('returnTosses', params.roomCode);
                        setReturned(true);
                        {/* TODO: enter summary page */}
                    }}
                >
                    RETURN TOSSES
                </button>
            </div>
        </>
    );
}
AdminPlay.propTypes = {
    players: PropTypes.array.isRequired,
};

export default AdminPlay;