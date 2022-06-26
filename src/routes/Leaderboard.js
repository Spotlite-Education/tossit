import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SocketContext } from '../context/socket';
import Corner from '../components/Corner';
import PlayerWorkBox from '../components/PlayerWorkBox';
import '../App.scss';

const PlayerResult = ({ data }) => {
    const [showToss, setShowToss] = React.useState(false);

    let placeColor;
    if (data.place === 1) {
        placeColor = 'rgb(255, 215, 0)';
    } else if (data.place === 2) {
        placeColor = 'rgb(220, 220, 220)';
    } else if (data.place === 3) {
        placeColor = 'rgb(205, 127, 50)';
    } else {
        placeColor = 'white';
    }
    return (
        <button className='leaderboard-result' onClick={() => setShowToss(!showToss)}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <p style={{ width: '33.33333%', textAlign: 'left', color: placeColor }}>{data.place}.</p>
                <b style={{ width: '33.33333%', textAlign: 'center' }}>{data.username}</b>
                <p style={{ width: '33.33333%', textAlign: 'right', color: '#DFDFDF' }}>{data.score}</p>
            </div>
            {showToss && <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlayerWorkBox
                    username={data.username}
                    questionData={data.toss.question}
                    answerData={data.toss.answer}
                    responded={true}
                />
            </div>}
        </button>
    );
}
PlayerResult.propTypes = {
    data: PropTypes.object.isRequired,
};

const Leaderboard = ({ handleExit }) => {
    const socket = React.useContext(SocketContext);
    const params = useParams();

    const [leaderboard, setLeaderboard] = React.useState([]);

    React.useEffect(() => {
        socket.emit('getLeaderboard', params.roomCode);
        socket.once('leaderboard', leaderboard => {
            setLeaderboard(leaderboard);
        });
    }, []);

    return (
        <>
            <nav id='nav-bar' style={{
                height: 100,
                textAlign: 'center',
                justifyContent: 'center',
            }}>
                <h1>Leaderboard:</h1>
            </nav>
            <main>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center', marginTop: '2rem' }}>
                    {leaderboard.map((data, index) =>
                        <PlayerResult
                            key={index}
                            data={data}
                        />
                    )}
                </div>
            </main>
            <Corner corner='tl' className='link-box'>
                <p className='link-text' style={{ color: '#FBFBFB', margin: '-0.5rem'  }} onClick={handleExit}>Go Back</p>
            </Corner>
        </>
    );
}
Leaderboard.propTypes = {
    handleExit: PropTypes.func.isRequired,
};

export default Leaderboard;