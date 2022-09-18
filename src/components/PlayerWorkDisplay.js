import React from 'react';
import PropTypes from 'prop-types';
import '../App.scss';
import PlayerWorkBox from './PlayerWorkBox';

const PlayerWorkList = ({ sectionPlayers, emitSetFlagged }) => {
    return (
        <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
            {sectionPlayers.map((player, index) =>
                <PlayerWorkBox
                    key={index}
                    username={player.username}
                    questionData={player.toss.question}
                    answerData={player.toss.answer}
                    likes={player.toss.likes}
                    responded={player.responded}
                    flaggable={true}
                    flagged={player.toss.flagged}
                    setFlagged={newFlagged => emitSetFlagged(player.socketId, newFlagged)}
                />
            )}
        </div>
    );
};
PlayerWorkList.propTypes = {
    sectionPlayers: PropTypes.array.isRequired,
    emitSetFlagged: PropTypes.func.isRequired,
}

const PlayerWorkSection = ({ title, sectionPlayers, emitSetFlagged }) => {
    if (sectionPlayers.length === 0) return null;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '3px solid gray' }}>
            <h5 style={{ marginTop: '1rem', padding: '1rem', textDecoration: 'underline' }}>{title}</h5>
            <PlayerWorkList
                sectionPlayers={sectionPlayers}
                emitSetFlagged={emitSetFlagged}
            />
        </div>
    );
};
PlayerWorkSection.propTypes = {
    title: PropTypes.string.isRequired,
    sectionPlayers: PropTypes.array.isRequired,
    emitSetFlagged: PropTypes.func.isRequired,
};

const PlayerWorkDisplay = ({ players, roomCode, socket }) => {
    const reviewPlayers = players.filter(player => (player.toss.question && player.toss.needsReview));
    const revisePlayers = players.filter(player => (player.toss.question && !player.toss.needsReview && player.toss.flagged));
    const unflaggedPlayers = players.filter(player => (player.toss.question && !player.toss.flagged));

    const emitSetFlagged = (socketId, flagged) => socket.emit('setFlagged', { roomCode: roomCode, socketId, flagged });

    return (
        <div className='scroll-box' style={{ width: '100%', boxSizing: 'border-box' }}>
            {
                unflaggedPlayers.length === players.length ?
                <PlayerWorkList
                    sectionPlayers={players}
                    emitSetFlagged={emitSetFlagged}
                /> :
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <PlayerWorkSection title='NEEDS YOUR REVIEW' sectionPlayers={reviewPlayers} emitSetFlagged={emitSetFlagged} />
                    <PlayerWorkSection title='AWAITING STUDENT REVISION' sectionPlayers={revisePlayers} emitSetFlagged={emitSetFlagged} />
                    <PlayerWorkSection title='NOT FLAGGED' sectionPlayers={unflaggedPlayers} emitSetFlagged={emitSetFlagged} />
                </div>
            }
        </div>
    )
};
PlayerWorkDisplay.propTypes = {
    players: PropTypes.array.isRequired,
    roomCode: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired,
};

export default PlayerWorkDisplay;