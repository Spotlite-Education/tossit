import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import '../styles/TeacherDashboard.scss';
import PropTypes from 'prop-types';

const PlayerBox = ({ username, handleKick }) => {
    return (
        <button type='button' className='player-box' onClick={handleKick}>
            {username}
        </button>
    );
}
PlayerBox.propTypes = {
    username: PropTypes.string.isRequired,
    handleKick: PropTypes.func.isRequired,
};

const TeacherDashboard = () => {
    const socket = React.useContext(SocketContext);
    const params = useParams();

    socket.emit('checkEnterTeacherDashboard', params.roomCode);
    socket.on('checkFail', ({ message }) => {
        console.log('ERROR ACCESSING TEACHER DASHBOARD: ' + message);
        return <Navigate to='/' />; // TODO: fix
    });

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

    return (
        <>
            <nav id='nav-bar'>
                <h1>ROOM CODE: <span id='room-code'>{params.roomCode}</span></h1>
            </nav>
            <main style={{ padding: '1.5rem' }}>
                <button
                    className='big-button'
                    style={{ bottom: '1rem', right: '1rem' }}
                    onClick={() => socket.emit('startSession', params.roomCode)}
                >
                    Start
                </button>
                <button className='small-button' onClick={() => socket.emit('tossRoom', params.roomCode)}>toss</button> {/* TMP - move this to after everyone has finished making their questions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {players.map((player, index) => {
                        return <PlayerBox key={index} username={player.username} handleKick={() => handleKick(player.socketId)} />;
                    })}
                </div>
            </main>
        </>
    );
}

export default TeacherDashboard;