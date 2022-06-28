import React from 'react';
import PropTypes from 'prop-types';
import Corner from '../../components/Corner';
import { AiFillHeart } from 'react-icons/ai';

const PlayerSummaryBox = ({ username, questionData, likes, correctResponses, totalResponses, correctOthersResponses, totalOthersResponses }) => {
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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 6, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontSize: '1.25rem', color: 'slategray' }}>{username} answered {correctResponses}/{totalResponses} planes correctly.</p>
                    <p style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '1.75rem', color: 'rgb(54, 54, 54)' }}>Q: {questionData.statement}</p>
                </div>
                <div style={{ flex: 1, height: '100%', display: 'flex', flexdirection: 'row', justifyContent: 'right', alignItems: 'center', gap: '5px' }}>
                    <p style={{ color: 'rgb(3, 34, 84)', fontSize: '1.5rem' }}>{likes}</p>
                    <AiFillHeart fill='#ff3d51' size='1.5rem' />
                </div>
            </div>
            <p style={{ fontSize: '1.25rem', color: 'slategray' }}>{correctOthersResponses}/{totalOthersResponses} players answered correctly.</p>
        </div>
    );
}
PlayerSummaryBox.propTypes = {
    username: PropTypes.string.isRequired,
    questionData: PropTypes.object.isRequired,
    likes: PropTypes.number.isRequired,
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
            <main style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {players.map((player, index) => {
                    let correctResponses = 0;
                    player.responses.forEach(response => { correctResponses += response.isCorrect; });
                    
                    let correctOthersResponses = 0;
                    player.othersResponses.forEach(response => { correctOthersResponses += response.isCorrect; });

                    return (<PlayerSummaryBox
                        key={index}
                        username={player.username}
                        questionData={player.toss.question}
                        likes={player.toss.likes}
                        correctResponses={correctResponses}
                        totalResponses={player.responses.length}
                        correctOthersResponses={correctOthersResponses}
                        totalOthersResponses={player.othersResponses.length}
                    />);
                })}
            </main>
            <Corner corner='tl' className='link-box'>
                <p className='link-text' style={{ color: '#FBFBFB', margin: '-0.5rem' }} onClick={handleOpenLeaderboard}>Leaderboard</p>
            </Corner>
        </>
    );
}
AdminSummary.propTypes = {
    players: PropTypes.array.isRequired,
    handleOpenLeaderboard: PropTypes.func.isRequired,
};

export default AdminSummary;