import React from 'react';
import PropTypes from 'prop-types';

const PlayerResult = ({ player }) => {
    return (
        <div style={{ width: '100%', backgroundColor: 'rgb(159, 173, 181)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1>{player.username}</h1>
        </div>
    );
}
PlayerResult.propTypes = {
    player: PropTypes.object.isRequired,
};

const AdminResults = ({ players }) => {
    const sortedPlayers = players; // TODO: sort players by score, percentage each player got right

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
                        />
                    )}
                </div>
            </main>
        </>
    );
}
AdminResults.propTypes = {
    players: PropTypes.array.isRequired,
};

export default AdminResults;