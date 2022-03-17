import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
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

const PlayerWorkBox = ({ username, questionStatement }) => {
    return (
        <>
            <div style={{ width: 300, height: 200 }}>
                <p>{questionStatement}</p>
            </div>
            <h3>{username}</h3>
        </>
    );
}
PlayerWorkBox.propTypes = {
    username: PropTypes.string.isRequired,
    questionStatement: PropTypes.string.isRequired,
};

const TeacherDashboard = () => {
    const socket = React.useContext(SocketContext);
    const params = useParams();

    React.useEffect(() => {
        socket.emit('checkEnterTeacherDashboard', params.roomCode);
        socket.on('checkFail', ({ message }) => {
            console.log('ERROR ACCESSING TEACHER DASHBOARD: ' + message);
            return <Navigate to='/' />; // TODO: fix
        });
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

    if (status === 'start') { // TODO: if doing multiple routes, make sure to socket.emit('checkEnterTeacherDashboard', params.roomCode);
        return (
            <>
                <main>
                    <h2>STUDENT WORK:</h2>
                    {players.map((player, index) => {
                        console.log('player toss ' + player.toss);
                        if (player.toss && player.toss.question) {
                            return <PlayerWorkBox
                                key={index}
                                username={player.username}
                                questionStatement={player.toss.question.statement}
                            />;
                        }
                    })}
                    <button className='small-button' onClick={() => socket.emit('tossRoom', params.roomCode)}>toss</button> {/* TODO: absolute positioning */}
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