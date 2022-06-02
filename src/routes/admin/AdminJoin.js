import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../context/socket';
import { motion } from 'framer-motion'

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
        <motion.div
            animate={{
                opacity: [0, 1, 1, 1],
                y: [null, -20, -20, -280],
            }}
            transition= {{
                duration: 3,
                times: [0, 0.4, 0.6, 1]
            }}
 
            >
            
            <div className='room-code'>
                <p style={{
                    fontFamily: 'Sans-Regular',
                    textAlign: 'center',
                    fontSize: '2rem',
                }}>Your room code is:</p>
                <h1 style={{
                    fontSize: '5rem',
                    textAlign: 'center',
                }}>{params.roomCode}</h1>
            </div>

        </motion.div>

            <main style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {players.map((player, index) => {
                        return <PlayerNameBox key={index} username={player.username} handleKick={() => handleKick(player.socketId)} />;
                    })}
                </div>
            </main>
            <div id='footer'>
                <p style={{ fontSize: '1.8rem' }}>Players joined: {players.length}</p>
                { players.length >= 2 && 
                    <button
                        className='big-button'
                        style={{ 
                            bottom: '1rem',
                            right: '1rem',                            
                        }}
                        onClick={() => {
                            socket.emit('startSession', params.roomCode);
                            handleStart();
                        }}
                    >
                        Start
                    </button>
                }
            </div>
                { players.length >= 1 &&
                    <div style={{
                        animation: 'fadeIn 1s',
                        fontFamily: 'Sans-Regular',
                        left: '90%',
                        top: '75%',
                        fontSize: '1.5rem'
                    }}>
                        {players.length} players
                    </div>
                }
                <div style={{ 
                    display: 'flex',
                    flexWrap: 'wrap', 
                    justifyContent: 'start',
                    marginTop: 140
                    }}>
                    {players.map((player, index) => {
                        return <PlayerNameBox key={index} username={player.username} handleKick={() => handleKick(player.socketId)} />;
                    })}
                </div>
                
            </main>

            </div>
        </>
    );
};
AdminJoin.propTypes = {
    players: PropTypes.array.isRequired,
    handleStart: PropTypes.func.isRequired,
};

export default AdminJoin;