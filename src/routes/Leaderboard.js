import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SocketContext } from '../context/socket';
import Corner from '../components/Corner';
import PlayerWorkBox from '../components/PlayerWorkBox';
import '../App.scss';
import plane from '../assets/images/plane.svg';
import { TossPlanes } from '../components/TossPlanes';
import { AiFillHeart } from 'react-icons/ai';

const leaderboardSortBy = ['score', 'likes'];
const leaderboardSortByNames = { score: 'Score', likes: 'Likes' };
const leaderboardDetailAppend = { score: ' Pts', likes: <AiFillHeart fill='#ff3d51' style={{ marginLeft: '0.5rem' }} /> };

const PlayerResult = ({ data, property }) => {
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
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                    <img src={plane} style={{ width: '3rem', height: '3rem', filter: placeColor }} alt="plane"></img>
                </div>
                <div style={{ flex: 2, textAlign: 'center', color: '#9C9C9C' }}>{data.username}</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'right', fontSize: '1.75rem', color: '#CCCCCC' }}>{data[property]}{leaderboardDetailAppend[property]}</div>
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
    property: PropTypes.string.isRequired,
};

const Leaderboard = ({ handleExit }) => {
    const socket = React.useContext(SocketContext);
    const params = useParams();

    const [sortedLeaderboards, setSortedLeaderboards] = React.useState([]);
    const [displayLeaderboardIndex, setDisplayLeaderboardIndex] = React.useState(0);

    React.useEffect(() => {
        socket.emit('getLeaderboard', params.roomCode);
        socket.once('leaderboard', leaderboard => {
            let newSortedLeaderboards = [];
            leaderboardSortBy.forEach(property => {
                const sorted = leaderboard.sort((a, b) => { return b[property] - a[property]; });
                let curPlace = 0, prevProperty = undefined;
                newSortedLeaderboards.push(sorted.map(leaderboardPlayerData => {
                    curPlace += prevProperty !== leaderboardPlayerData[property];
                    prevProperty = leaderboardPlayerData[property];
                    return {
                        ...leaderboardPlayerData,
                        place: curPlace,
                    };
                }));
            });
            setSortedLeaderboards(newSortedLeaderboards);
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
                {sortedLeaderboards.length === 0 ?
                    <>
                        <div id='loading'>
                            <TossPlanes />
                        </div>
                        <p className='loading-text' style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',   
                            transform: 'translate(-50%, 5rem)',      
                            display: 'flex',
                            flexDirection: 'column',    
                            alignItems: 'center'
                        }}>
                            Loading leaderboard...
                        </p>
                    </>
                    :
                    <>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', fontSize: '1.8rem' }}>
                            <p>Sort by:</p>
                            {leaderboardSortBy.map((sortBy, index) =>
                                <button
                                    key={index}
                                    className='small-button'
                                    style={{ opacity: displayLeaderboardIndex === index ? 0.5 : 1 }}
                                    disabled={displayLeaderboardIndex === index}
                                    onClick={() => setDisplayLeaderboardIndex(index)}
                                >
                                    {leaderboardSortByNames[sortBy]}
                                </button>)
                            }
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center', marginTop: '2rem' }}>
                            {sortedLeaderboards[displayLeaderboardIndex].map((data, index) =>
                                <PlayerResult
                                    key={index}
                                    data={data}
                                    property={leaderboardSortBy[displayLeaderboardIndex]}
                                />
                            )}
                        </div>
                    </>
                }
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