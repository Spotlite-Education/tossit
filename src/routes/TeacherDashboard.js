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
    return (
        <>
            <h3>{username}</h3>
            <div style={{ width: 300, height: 200, backgroundColor: 'red' }}>
                <p>{questionData.statement}</p>
                <p>{answerData}</p>
                {responses.map((response, index) => {
                    return <p key={index}>{response.username}: {response.isCorrect ? 'Correct' : 'Incorrect'}</p>;
                })}
            </div>
        </>
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
                <main>
                    <h2>STUDENT WORK:</h2>
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
                    <button className='small-button' onClick={() => socket.emit('tossRoom', params.roomCode)}>TOSS</button> {/* TODO: absolute positioning */}
                    <button className='small-button' onClick={() => socket.emit('returnTosses', params.roomCode)}>RETURN TOSSES</button> {/* TODO: absolute positioning */}
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