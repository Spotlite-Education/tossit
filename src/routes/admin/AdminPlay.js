import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../context/socket';

const PlayerWorkBox = ({ username, questionData, answerData, responses }) => {
    const [showing, setShowing] = React.useState('question');
    const handleSwitch = () => {
        switch (showing) {
            case 'question':
                setShowing('answer');
                break;
            case 'answer':
                setShowing('question');
                break;
            default:
                setShowing('question');
                break;
        }
    }


    /*
    
    
    TODO: make players updating work...
    Refactor playerhome more, then commit.
    Check server checkUsername.
    
    
    */


    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '1rem' }}>
            <div 
                className='player-work-box'
                style={{ width: 500, height: 250, }}
                onClick={() => handleSwitch()}
            >
                {showing === 'question' ? <p>{questionData.statement}</p> : <p>{answerData}</p>}                
                <br />
                {responses.length > 0 &&
                    <>
                        <h3>Player Responses:</h3>
                        {responses.map((response, index) => {
                            return <p key={index}>{response.username}: {response.isCorrect ? 'Correct' : 'Incorrect'}</p>;
                        })}
                    </>
                }
            </div>
            <h3>{username}</h3>
        </div>
    );
}
PlayerWorkBox.propTypes = {
    username: PropTypes.string.isRequired,
    questionData: PropTypes.object.isRequired,
    answerData: PropTypes.string.isRequired,
    responses: PropTypes.array.isRequired,
};

const AdminPlay = ({ players }) => {
    const socket = React.useContext(SocketContext);
    const params = useParams();
    
    const [tossed, setTossed] = React.useState(false);
    const [returned, setReturned] = React.useState(false);

    return (
        <>
            <nav id='nav-bar' style={{
                height: 100,
                textAlign: 'center',
            }}>
                <h1>PLAYER WORK:</h1>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button
                        className='small-button'
                        style={{ margin: 15, opacity: tossed ? 0.5 : 1 }}
                        disabled={tossed}
                        onClick={() => {
                            socket.emit('tossRoom', params.roomCode);
                            setTossed(true);
                        }}
                    >
                        {tossed ? 'TOSSED' : 'TOSS'}
                    </button> {/* TODO: absolute positioning */}
                    <button
                        className='small-button'
                        style={{ width: 'auto', paddingLeft: 10, paddingRight: 10, opacity: returned ? 0.5 : 1 }}
                        disabled={returned}
                        onClick={() => {
                            socket.emit('returnTosses', params.roomCode);
                            setReturned(true);
                        }}
                    >
                        RETURN TOSSES
                    </button> {/* TODO: absolute positioning */}
                </div>
                {/* TODO: enter summary page */}
            </main>
        </>
    );
}
AdminPlay.propTypes = {
    players: PropTypes.array.isRequired,
};

export default AdminPlay;