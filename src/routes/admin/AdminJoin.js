import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../context/socket';
import { motion } from 'framer-motion';
import Input from '../../components/Input';
import * as constants from '../../util/constants';
import ErrorDisplay from '../../components/ErrorDisplay';

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

const AdminJoin = ({ players }) => {
    const socket = React.useContext(SocketContext);
    const params = useParams();

    const [showTimer, setShowTimer] = React.useState(false);

    const [errorExists, setErrorExists] = React.useState(false);

    if (showTimer) {
        return (
            <div>
                <h1 style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%) translateY(-5rem)' }}>Set time to make questions:</h1>
                <Input
                    width='30%'
                    height='2.5rem'
                    numInputs={4}
                    inputNumberLimit={constants.TOSS.CREATION.TIME.MAX_INPUTS}
                    idxSplit={2}
                    splitString=':'
                    outlineStyle='underscore'
                    textId='room-code-text'
                    onlyNumbers={true}
                    onSubmit={time => {
                        const minutes = parseInt(time.substring(0, 2));
                        const seconds = parseInt(time.substring(2, 4));
                        const durationSeconds = minutes * 60 + seconds;
                        if (durationSeconds >= constants.TOSS.CREATION.TIME.MIN_SECONDS) {
                            socket.emit('startSession', { roomCode: params.roomCode, durationSeconds });
                            setErrorExists(false);
                        } else {
                            setErrorExists(true);
                        }

                    }}
                />
                {errorExists &&
                    <ErrorDisplay
                        errorMessage='Set time is too short!'
                    />
                }
            </div>
        );
    }

    
    const handleKick = (socketId) => {
        socket.emit('kickPlayer', { roomCode: params.roomCode, socketId });
    }
    
    return (
        <>
            <motion.div
                animate={{
                    opacity: [0, 1, 1, 1],
                    y: [null, -20, -20, -300],
                }}
                transition={{
                    duration: 3,
                    times: [0, 0.4, 0.6, 1]
                }} 
            >
                <div className='room-code'>
                    <p 
                        className='unselectable'
                        style={{
                            fontFamily: 'Sans-Regular',
                            textAlign: 'center',
                            fontSize: '2rem',
                        }}>Your room code is:</p>
                    <h1 id='room-code-text' style={{
                        fontSize: '5rem',
                        textAlign: 'center',
                    }}>{params.roomCode.substring(0, constants.ROOM_CODE.LEFT_LENGTH) + '-' + params.roomCode.substring(constants.ROOM_CODE.RIGHT_LENGTH, params.roomCode.length)}</h1>
                </div>
            </motion.div>

            <motion.div
                animate={{
                    opacity: [0, 0, 1],
                }}
                transition={{
                    duration: 4,
                    times: [0, 0.8, 1]
                }} 
                id='footer'
            >
                <p style={{ fontSize: '1.5rem' }}>Players joined: {players.length}</p>
                { players.length >= 2 && 
                    <button
                        className='big-button'
                        style={{ 
                            backgroundColor: 'rgba(76,88,117,255)',
                            top: '54%',
                            left: '89%',     
                                                
                        }}
                        onClick={() => {
                            setShowTimer(true);
                        }}
                    >
                        Start
                    </button>
                }
            </motion.div>

            <div style={{ 
                position: 'absolute',
                display: 'flex',
                flexWrap: 'wrap', 
                justifyContent: 'start',
                marginTop: 190
                }}>
                {players.map((player, index) => {
                    return <PlayerNameBox key={index} username={player.username} handleKick={() => handleKick(player.socketId)} />;
                })}
            </div>
        </>                
    );
};

AdminJoin.propTypes = {
    players: PropTypes.array.isRequired
};

export default AdminJoin;