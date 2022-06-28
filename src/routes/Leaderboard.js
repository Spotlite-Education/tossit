import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SocketContext } from '../context/socket';
import Corner from '../components/Corner';
import PlayerWorkBox from '../components/PlayerWorkBox';
import '../App.scss';
import plane from '../assets/images/plane.svg';

const PlayerResult = ({ data }) => {
    const [showToss, setShowToss] = React.useState(false);

    let placeColor;
    if (data.place === 1) {
        placeColor = 'invert(3%) sepia(26%) saturate(4505%) hue-rotate(309deg) brightness(115%) contrast(107%)';
    } else if (data.place === 2) {
        placeColor = 'invert(10%) sepia(26%) saturate(100%) hue-rotate(87deg) brightness(100%) contrast(93%)';
    } else if (data.place === 3) {
        placeColor = 'invert(33%) sepia(31%) saturate(391%) hue-rotate(1deg) brightness(91%) contrast(83%)';
    } else {
        placeColor = 'brightness(90%)';
    }

    return (
        <button className='leaderboard-result' onClick={() => setShowToss(!showToss)}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%',}}>
                <img src={plane} style={{verticalAlign: 'middle', width: '50px', flex: 1, textAlign: 'left', filter: placeColor}} alt="plane"></img>
                <div style={{ flex: 4, verticalAlign: 'middle', textAlign: 'center', color: '#9C9C9C' }}>{data.username}</div>
                <div style={{ flex: 1, verticalAlign: 'middle', textAlign: 'right', color: '#CCCCCC ' }}>{data.score}</div>
            </div>

            {showToss && <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlayerWorkBox
                    username={data.username}
                    questionData={data.toss.question}
                    answerData={data.toss.answer}
                    likes={data.toss.likes}
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