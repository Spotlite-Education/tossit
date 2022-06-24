import React from 'react';
import PropTypes from 'prop-types';

const PlayerResult = ({ player, index }) => {
    let backgroundColor;
    if (index === 0) { // first place
        backgroundColor = 'rgb(255, 215, 0)';
    } else if (index === 1) {
        backgroundColor = 'rgb(192, 192, 192)';
    } else if (index === 2) {
        backgroundColor = 'rgb(205, 127, 50)';
    } else {
        backgroundColor = 'rgb(159, 173, 181)';
    }
    return (
        <div style={{ width: '100%', backgroundColor, borderRadius: '1rem', display: 'flex', flexDirection: 'row', gap: '3rem', alignItems: 'center', justifyContent: 'center' }}>
            <h2>{player.username}</h2>
            <p>|</p>
            <p>{player.score}</p>
        </div>
    );
}
PlayerResult.propTypes = {
    player: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

const Leaderboard = ({ players }) => {
    const sortedPlayers = players.sort((a, b) => {
        return b.score - a.score;
    });

    return (
        <>
            <nav id='nav-bar' style={{
                height: 100,
                textAlign: 'center',
            }}>
                <h1>Results:</h1>
            </nav>
            <main>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginTop: '2rem' }}>
                    {sortedPlayers.map((player, index) =>
                        <PlayerResult
                            key={index}
                            player={player}
                            index={index}
                        />
                    )}
                </div>
            </main>
        </>
    );
}
Leaderboard.propTypes = {
    players: PropTypes.array.isRequired,
};

export default Leaderboard;