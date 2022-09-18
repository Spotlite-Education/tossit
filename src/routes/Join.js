import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCheckRoomExists } from '../util/checkhooks';
import Input from '../components/Input';
import Corner from '../components/Corner';
import ErrorDisplay from '../components/ErrorDisplay';
import '../styles/Join.scss';
import { SocketContext } from '../context/socket';
import { LoadingPlane } from '../components/LoadingPlane';
import { TossPlanes } from '../components/TossPlanes';
import CombinedLogo from '../assets/images/logocombined.svg';
import * as constants from '../util/constants';

const Join = () => {
    const [roomCode, setRoomCode] = React.useState('');
    const [showUsername, setShowUsername] = React.useState(false);
    const [status, setStatus] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const socket = React.useContext(SocketContext);
    useCheckRoomExists(socket);
    const navigate = useNavigate();
    
    const handleError = React.useCallback(({ error }) => {
        setStatus('');
        if (error === 'roomCode') {
            setErrorMessage('Room code does not exist. Please enter a valid room code!');
            setShowUsername(false);
        } else if (error === 'username') {
            setErrorMessage('Username is invalid. Please enter a valid username!');
        }
    }, []);
    React.useEffect(() => {
        socket.on('errorMessage', handleError);

        return () => {
            socket.off('errorMessage', handleError);
        };
    }, [socket]);

    const handleSubmitRoomCode = newRoomCode => {
        setErrorMessage('');
        socket.emit('checkRoomExists', newRoomCode);
        socket.once('successMessage', successRoomCode => {
            setRoomCode(successRoomCode);
            setShowUsername(true);
        });
    }

    const handleChange = (e) => {
        setUsername(e.target.value);
    }

    const handleJoin = (e, username) => {
        e.preventDefault();
        setErrorMessage('');
        setStatus('loading');
        socket.emit('joinRoom', { roomCode, username } );

        socket.once('kickPlayer', () => {
            console.log('You have been kicked by the admin of this room!');
            navigate(0);
        });

        socket.once('joined', () => {
            setStatus('waiting');
        });

        socket.once('startSession', ({ startTime, durationSeconds }) => {
            setTimeout(() => {
                //setStatus('joined');
                navigate(`/${roomCode}`, { state: {
                    username,
                    timerData: {
                        start: new Date(startTime),
                        durationSeconds
                    }
                } });
            }, 1500);
            setStatus('joinTransition');
        });
    }

    switch(status) {
        case 'loading':
            return (
                <div id='loading'>
                    <TossPlanes />
                    <p className='loading-text'>Joining the room...</p>
                </div>
            );
        case 'waiting':
            return (
                <div id='loading'>
                    <LoadingPlane />
                    <p className='loading-text'>Waiting for start...</p>                    
                </div>
            );
        case 'joinTransition':
            return (
                <h1 id='centered-subtitle'>Create a question!</h1> // TODO: make text animate by moving upwards, and then switch status to joined
            );
    }

    return (
      <>
        <main>
            {
                showUsername ?
                <> {/* Username Input */}
                    <h1 id='raised-subtitle'>NAME</h1>
                    <form onSubmit={(e) => handleJoin(e, username)}>
                        <input type='text' id='nameInput' autoFocus maxLength={20} value={username} onChange={(e) => handleChange(e)}></input>
                    </form>
                </> :
                <> {/* Title, Room Code Input */}
                    <img src={CombinedLogo} className='logo' />
                    <Input
                        width='30%'
                        height='2.5rem'
                        numInputs={constants.ROOM_CODE.LEFT_LENGTH + constants.ROOM_CODE.RIGHT_LENGTH}
                        outlineStyle='underscore'
                        idxSplit={constants.ROOM_CODE.LEFT_LENGTH}
                        splitString='-'
                        textId='room-code-text'
                        onSubmit={handleSubmitRoomCode}
                    />
                </>
            }
            {errorMessage &&
                <ErrorDisplay
                    errorMessage={errorMessage}
                />
            }
            <Corner corner='tr'>
                <Link className='link-text' to='/create'>To Teacher Mode</Link>
            </Corner>
        </main>
      </>
    );
}

export default Join;