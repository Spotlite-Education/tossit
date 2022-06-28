import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../context/socket';
import PlayerWorkBox from '../../components/PlayerWorkBox';
import TimerDisplay from '../../components/TimerDisplay';

const AdminPlay = ({ players, timerData, handleOpenSummary }) => {
    const socket = React.useContext(SocketContext);
    const params = useParams();
    
    const [tossIteration, setTossIteration] = React.useState(0);
    const [returned, setReturned] = React.useState(false);
    
    const tossedPlayers = players.filter(player => player.toss.question);
    const canForceSetTosses = tossIteration === 0;
    const canToss = (tossedPlayers.length === players.length) && (tossIteration < players.length - 1);
    const canReturn = !returned && tossIteration > 0;
    const canSummary = returned;

    const handleTossRoom = React.useCallback(() => {
        setTossIteration(tossIteration + 1);
        // TODO: add animation after clicking the toss button
    }, []);

    React.useEffect(() => {
        socket.once('forceTossRoom', () => {
            handleTossRoom();
            // TODO: change state to hide timer
        });
    }, []);

    return (
        <>
            <nav id='nav-bar' style={{
                height: 100,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <h1 style={{verticalAlign: 'middle', textAlign: 'middle'}}>Planes:</h1>
                <button
                    className='small-button'
                    style={{ width: '8.5rem',paddingLeft: '1rem', paddingRight: '1rem', margin: '1rem', opacity: canForceSetTosses ? 1 : 0.5, fontSize: '1.5vw' }}
                    disabled={!canForceSetTosses}
                    onClick={() => {
                        socket.emit('forceSetRoomTosses', params.roomCode);
                    }}
                >
                    Force Toss
                </button>
                <button
                    className='small-button'
                    style={{ margin: '1rem', opacity: canToss ? 1 : 0.5, fontSize: '1.5vw' }}
                    disabled={!canToss}
                    onClick={() => {
                        socket.emit('tossRoom', params.roomCode);
                        handleTossRoom();
                    }}
                >
                    Toss
                </button>
                <button
                    className='small-button'
                    style={{ width: 'auto', paddingLeft: '1rem', paddingRight: '1rem', margin: '1rem', opacity: canReturn ? 1 : 0.5, fontSize: '1.5vw' }}
                    disabled={!canReturn}
                    onClick={() => {
                        socket.emit('returnTosses', params.roomCode);
                        setReturned(true);
                    }}
                >
                    Return Tosses
                </button>
                <button
                    className='small-button'
                    style={{ width: 'auto', paddingLeft: '1rem', paddingRight: '1rem', margin: '1rem', opacity: canSummary ? 1 : 0.5, fontSize: '1.5vw' }}
                    disabled={!canSummary}
                    onClick={handleOpenSummary}
                >
                    Summary
                </button>
                {tossIteration === 0 && 
                <TimerDisplay
                    startTime={timerData.start}
                    durationSeconds={timerData.durationSeconds}
                />}
            </nav>
            <main>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around'
                    }}
                >
                    {players.map((player, index) => {
                        if (player.toss.question) {
                            return <PlayerWorkBox
                                key={index}
                                username={player.username}
                                questionData={player.toss.question}
                                answerData={player.toss.answer}
                                likes={player.toss.likes}
                                responded={player.responded}
                            />;
                        }
                    })}
                </div>
            </main>
            <div id='footer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', paddingTop: '1.3rem', paddingBottom: '1.3rem' }}>
                {tossIteration > 0 &&
                    <div style={{ width: '24rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25vw' }}>
                        <h2>Everyone has tossed {tossIteration} time{tossIteration === 1 ? '' : 's'}.</h2>
                    </div>
                }
            </div>
        </>
    );
}
AdminPlay.propTypes = {
    players: PropTypes.array.isRequired,
    timerData: PropTypes.object.isRequired,
    handleOpenSummary: PropTypes.func.isRequired,
};

export default AdminPlay;