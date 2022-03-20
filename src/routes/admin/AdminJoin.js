import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../context/socket';

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

const AdminJoin = ({ players, handleStart }) => {
    const socket = React.useContext(SocketContext);
    const params = useParams();

    const handleKick = (socketId) => {
        socket.emit('kickPlayer', { roomCode: params.roomCode, socketId });
    }

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
                            handleStart();
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
};
AdminJoin.propTypes = {
    players: PropTypes.array.isRequired,
    handleStart: PropTypes.func.isRequired,
};

export default AdminJoin;