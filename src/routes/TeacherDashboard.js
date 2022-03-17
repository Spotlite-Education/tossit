import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import '../styles/TeacherDashboard.scss';
import PropTypes from 'prop-types';

const PlayerNameBox = ({ username, handleKick }) => {
    return (
        <button type='button' className='player-box' onClick={handleKick}>
            {username}
        </button>
    );
}
PlayerNameBox.propTypes = {
    username: PropTypes.string.isRequired,
    handleKick: PropTypes.func.isRequired,
};

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
                        <h3>Student Responses:</h3>
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

const TeacherDashboard = () => {
    const socket = React.useContext(SocketContext);
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        socket.emit('checkEnterTeacherDashboard', params.roomCode);
        socket.on('checkFail', ({ message }) => {
            console.log('ERROR ACCESSING TEACHER DASHBOARD: ' + message);
            navigate('/');
            console.log('navigated');
            return;
        });
        setLoading(false);

        // TODO: use callback and do useeffect cleanup for checkFail listener
    }, []);

    const [status, setStatus] = React.useState('join'); // join, start, summary
    const [players, setPlayers] = React.useState([]);
    const [tossed, setTossed] = React.useState(false);

    const handlePlayersChanged = React.useCallback(newPlayers => {
        setPlayers(newPlayers);
    });

    const handleKick = (socketId) => {
        socket.emit('kickPlayer', { roomCode: params.roomCode, socketId });
    }

    React.useEffect(() => {
        socket.on('playersChanged', handlePlayersChanged);

        return () => {
            socket.off('playersChanged', handlePlayersChanged);
        }
    }, [socket]);

    if (loading) {
        return null;
    }

    if (status === 'start') { // TODO: if doing multiple routes, make sure to socket.emit('checkEnterTeacherDashboard', params.roomCode);
        return (
            <>
                <nav id='nav-bar' style= {{
                    height: 100,
                    textAlign: 'center',
                }}>
                    <h1>STUDENT WORK:</h1>
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
                        <button className='small-button' style={{ margin: 15, opacity: tossed ? 0.5 : 1 }} disabled={tossed} onClick={() => {
                            socket.emit('tossRoom', params.roomCode);
                            setTossed(true);
                        }}>{tossed ? 'TOSSED' : 'TOSS'}</button> {/* TODO: absolute positioning */}
                        <button className='small-button' style={{ width: 'auto', paddingLeft: 10, paddingRight: 10 }} onClick={() => socket.emit('returnTosses', params.roomCode)}>RETURN TOSSES</button> {/* TODO: absolute positioning */}
                    </div>
                    {/* TODO: enter summary page */}
                </main>
            </>
        );
    }
    else {
        return (
            <>
                <nav id='nav-bar' style= {{
                    height: 100,
                    textAlign: 'center',
                }}>
                    <h1>ROOM CODE: <span id='room-code'>{params.roomCode}</span></h1>
                </nav>
                <main style={{ padding: '1.5rem' }}>
                    { players.length >= 2 && 
                        <button
                            className='big-button'
                            style={{ bottom: '1rem', right: '1rem' }}
                            onClick={() => {
                                socket.emit('startSession', params.roomCode);
                                setStatus('start');
                            }}
                        >
                            Start
                        </button>
                    }
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        {players.map((player, index) => {
                            return <PlayerNameBox key={index} username={player.username} handleKick={() => handleKick(player.socketId)} />;
                        })}
                    </div>
                </main>
            </>
        );
    }
}

export default TeacherDashboard;