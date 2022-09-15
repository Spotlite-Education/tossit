import React from 'react';
import PropTypes from 'prop-types';
import '../App.scss';
import PlayerWorkBox from './PlayerWorkBox';

const PlayerWorkSection = ({ title, sectionPlayers, emitSetFlagged }) => {
    if (sectionPlayers.length === 0) return null;
    return (
        <>
            <h5 style={{ marginTop: '1rem', padding: '1rem' }}>{title}</h5>
            <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', paddingBottom: '1rem', borderBottom: '3px solid' }}>
                {sectionPlayers.map((player, index) => {
                    return <PlayerWorkBox
                        key={index}
                        username={player.username}
                        questionData={player.toss.question}
                        answerData={player.toss.answer}
                        likes={player.toss.likes}
                        responded={player.responded}
                        flaggable={true}
                        flagged={player.toss.flagged}
                        setFlagged={newFlagged => emitSetFlagged(player.socketId, newFlagged)}
                    />;
                })}
            </div>
        </>
    );
};
PlayerWorkSection.propTypes = {
    title: PropTypes.string.isRequired,
    sectionPlayers: PropTypes.array.isRequired,
    emitSetFlagged: PropTypes.func.isRequired,
};

const PlayerWorkDisplay = ({ players, roomCode, socket }) => {
    const emitSetFlagged = (socketId, flagged) => socket.emit('setFlagged', { roomCode: roomCode, socketId, flagged });

    return (
        <div className='scroll-box' style={{ width: '100%', justifyContent: 'left' }}>
            <PlayerWorkSection title='NEEDS YOUR REVIEW' sectionPlayers={players.filter(player => (player.toss.question && player.toss.needsReview))} emitSetFlagged={emitSetFlagged} />
            <PlayerWorkSection title='AWAITING STUDENT REVISION' sectionPlayers={players.filter(player => (player.toss.question && !player.toss.needsReview && player.toss.flagged))} emitSetFlagged={emitSetFlagged} />
            <PlayerWorkSection title='NOT FLAGGED' sectionPlayers={players.filter(player => (player.toss.question && !player.toss.flagged))} emitSetFlagged={emitSetFlagged} />
        </div>
    )
};
PlayerWorkDisplay.propTypes = {
    players: PropTypes.array.isRequired,
    roomCode: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired,
};

export default PlayerWorkDisplay;