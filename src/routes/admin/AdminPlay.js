import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../context/socket';
import { FRQ, MCQ } from '../player/PlayerCreate';
import { generateId } from '../../util/random';

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
                backgroundColor: responded ? 'white' : 'rgb(235, 192, 52)',
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

const AdminPlay = ({ players, openLeaderboard }) => {
    const socket = React.useContext(SocketContext);
    const params = useParams();
    
    const [tossIteration, setTossIteration] = React.useState(0);
    const [returned, setReturned] = React.useState(false);
    
    const tossedPlayers = players.filter(player => player.toss.question);
    const canToss = (tossedPlayers.length === players.length) && (tossIteration < players.length - 1);
    const canReturn = !returned && tossIteration > 0;
    const canSummary = returned;

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
                                responded={player.responded}
                            />;
                        }
                    })}
                </div>
            </main>
            <div id='footer' style={{ display: 'flex', gap: '1.5rem', paddingTop: '1.3rem', paddingBottom: '1.3rem' }}>
                <button
                    className='small-button'
                    style={{ margin: '1rem', opacity: canToss ? 1 : 0.5 }}
                    disabled={!canToss}
                    onClick={() => {
                        socket.emit('tossRoom', params.roomCode);
                        setTossIteration(tossIteration + 1);
                        // TODO: add animation after clicking the toss button
                    }}
                >
                    TOSS
                </button>
                <button
                    className='small-button'
                    style={{ width: 'auto', paddingLeft: '1rem', paddingRight: '1rem', margin: '1rem', opacity: canReturn ? 1 : 0.5 }}
                    disabled={!canReturn}
                    onClick={() => {
                        socket.emit('returnTosses', params.roomCode);
                        setReturned(true);
                    }}
                >
                    RETURN TOSSES
                </button>
                <button
                    className='small-button'
                    style={{ width: 'auto', paddingLeft: '1rem', paddingRight: '1rem', margin: '1rem', opacity: canSummary ? 1 : 0.5 }}
                    disabled={!canSummary}
                    onClick={openLeaderboard}
                >
                    SUMMARY
                </button>
                {tossIteration > 0 &&
                    <div style={{ width: '24rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: '3rem' }}>
                        <h2>Everyone has tossed {tossIteration} time{tossIteration === 1 ? '' : 's'}.</h2>
                    </div>
                }
            </div>
        </>
    );
}
AdminPlay.propTypes = {
    players: PropTypes.array.isRequired,
    openLeaderboard: PropTypes.func.isRequired,
};

export default AdminPlay;