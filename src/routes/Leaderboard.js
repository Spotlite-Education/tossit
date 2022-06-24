import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SocketContext } from '../context/socket';
import Corner from '../components/Corner';

const PlayerResult = ({ data }) => {
    let backgroundColor;
    if (data.place === 1) {
        backgroundColor = 'rgb(255, 215, 0)';
    } else if (data.place === 2) {
        backgroundColor = 'rgb(192, 192, 192)';
    } else if (data.place === 3) {
        backgroundColor = 'rgb(205, 127, 50)';
    } else {
        backgroundColor = 'rgb(159, 173, 181)';
    }
    return (
        <div style={{ width: '50%', backgroundColor, borderRadius: '1rem', display: 'flex', flexDirection: 'row', gap: '3rem', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <p>{data.place}. {data.username} | {data.score}</p>
        </div>
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
                <p className='link-text' style={{ color: '#FBFBFB' }} onClick={handleExit}>Go Back</p>
            </Corner>
        </>
    );
}
Leaderboard.propTypes = {
    handleExit: PropTypes.func.isRequired,
};

export default Leaderboard;