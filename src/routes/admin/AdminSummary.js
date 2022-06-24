import React from 'react';
import PropTypes from 'prop-types';
import Corner from '../../components/Corner';

const PlayerSummaryBox = ({ username, questionData, correctResponses, totalResponses, correctOthersResponses, totalOthersResponses }) => {
    return (
        <div 
            style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: '35rem',
                height: 'fit-content',
                boxSizing: 'border-box',
                margin: '1.5rem',
                padding: '1.5rem',
                backgroundColor: 'white',
            }}
        >
            <p style={{ fontSize: '1.25rem', color: 'slategray' }}>{username} answered {correctResponses}/{totalResponses} planes correctly.</p>
            <p style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '1.75rem', color: 'rgb(54, 54, 54)' }}>Q: {questionData.statement}</p>
            <p style={{ fontSize: '1.25rem', color: 'slategray' }}>{correctOthersResponses}/{totalOthersResponses} players answered correctly.</p>
        </div>
    );
}
PlayerSummaryBox.propTypes = {
    username: PropTypes.string.isRequired,
    questionData: PropTypes.object.isRequired,
    correctResponses: PropTypes.number.isRequired,
    totalResponses: PropTypes.number.isRequired,
    correctOthersResponses: PropTypes.number.isRequired,
    totalOthersResponses: PropTypes.number.isRequired,
};

const AdminSummary = ({ players, handleOpenLeaderboard }) => {
    return (
        <>
            <nav id='nav-bar' style={{
                height: 100,
                textAlign: 'center',
                justifyContent: 'center',
            }}>
                <h1>Summary:</h1>
            </nav>
            <main>
                {players.map((player, index) => {
                    let correctResponses = 0;
                    player.responses.forEach(response => { correctResponses += response.isCorrect; });
                    
                    let correctOthersResponses = 0;
                    player.othersResponses.forEach(response => { correctOthersResponses += response.isCorrect; });

                    return (<PlayerSummaryBox
                        key={index}
                        username={player.username}
                        questionData={player.toss.question}
                        correctResponses={correctResponses}
                        totalResponses={player.responses.length}
                        correctOthersResponses={correctOthersResponses}
                        totalOthersResponses={player.othersResponses.length}
                    />);
                })}
            </main>
            <Corner corner='tl' className='link-box'>
                <p className='link-text' style={{ color: '#FBFBFB' }} onClick={handleOpenLeaderboard}>Leaderboard</p>
            </Corner>
        </>
    );
}
AdminSummary.propTypes = {
    players: PropTypes.array.isRequired,
    handleOpenLeaderboard: PropTypes.func.isRequired,
};

export default AdminSummary;