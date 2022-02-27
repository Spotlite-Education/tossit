import React from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import '../styles/TeacherDashboard.scss';
import PropTypes from 'prop-types';

const PlayerBox = ({ username }) => {
    return (
        <div>{username}</div> // TODO - make it look better
    );
}
PlayerBox.propTypes = {
    username: PropTypes.string.isRequired,
};

const TeacherDashboard = () => {
    const [players, setPlayers] = React.useState([]);
    
    const socket = React.useContext(SocketContext);
    const params = useParams();

    const handlePlayerJoined = React.useCallback(newPlayers => {
        setPlayers(newPlayers);
    });

    React.useEffect(() => {
        socket.on('playerJoined', handlePlayerJoined);

        return () => {
            socket.off('playerJoined', handlePlayerJoined);
        }
    }, [socket]);

    return (
        <>
            <nav id='nav-bar'>
                <h1>Your Room Code: <span id='room-code'>{params.roomCode}</span></h1>
            </nav>
            <main>
                <button onClick={() => socket.emit('startSession', params.roomCode)}>Start Session</button>
                <button onClick={() => socket.emit('tossRoom', params.roomCode)}>toss</button> {/* TMP - move this to after everyone has finished making their questions */}
                {players.map((player, index) => {
                    return <PlayerBox key={index} username={player.username}/>;
                })}
            </main>
        </>
    );
}

export default TeacherDashboard;