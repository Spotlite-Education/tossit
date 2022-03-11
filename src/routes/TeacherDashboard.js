import React from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import '../styles/TeacherDashboard.scss';
import PropTypes from 'prop-types';

const PlayerBox = ({ username }) => {
    return (
        <li className='player-box'>
            {username}
        </li>
    );
}
PlayerBox.propTypes = {
    username: PropTypes.string.isRequired,
};

const TeacherDashboard = () => {
    const [players, setPlayers] = React.useState([]);
    
    const socket = React.useContext(SocketContext);
    const params = useParams();

    const handlePlayersChanged = React.useCallback(newPlayers => {
        setPlayers(newPlayers);
    });

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
            <main>
                <button
                    className='big-button'
                    style={{ bottom: '1rem', right: '1rem' }}
                    onClick={() => socket.emit('startSession', params.roomCode)}
                >
                    Start
                </button>
                <button onClick={() => socket.emit('tossRoom', params.roomCode)}>toss</button> {/* TMP - move this to after everyone has finished making their questions */}
                <ul id='player-list'>
                    {players.map((player, index) => {
                        return <PlayerBox key={index} username={player.username}/>;
                    })}
                </ul>
            </main>
        </>
    );
}

export default TeacherDashboard;