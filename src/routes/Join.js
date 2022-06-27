import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Corner from '../components/Corner';
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

    const socket = React.useContext(SocketContext);
    const navigate = useNavigate();
    
    const handleError = React.useCallback(({ error }) => {
        setStatus('');
        if (error === 'roomCode') {
            setShowUsername(false);
        } else if (error === 'username') {
            //alert('Enter a valid username');
            // do nothing is fine - otherwise, it will always alert because form submits too fast
        }
    }, []);
    React.useEffect(() => {
        socket.on('errorMessage', handleError);

        return () => {
            socket.off('errorMessage', handleError);
        };
    }, [socket]);

    const handleChange = (e) => {
        setUsername(e.target.value);
    }

    const handleJoin = (e, username) => { // FIX WHY IS IT BEING CALLED BY ROOMACODOJEOPDJPOA JDOP
        e.preventDefault();
        setStatus('loading');
        socket.emit('joinRoom', { roomCode, username } );

        socket.once('kickPlayer', () => {
            console.log('You have been kicked by the admin of this room!');
            setStatus('kicked');
        });

        socket.once('joined', () => {
            setStatus('waiting');
        })

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
        case 'kicked':
            window.location.reload();
            return null;
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
            {/* Title */}
            {!showUsername && <React.Fragment>
                <img src={CombinedLogo} className='logo' />
                <Input
                    width='30%'
                    height='2.5rem'
                    numInputs={constants.ROOM_CODE_LEFT_LENGTH + constants.ROOM_CODE_RIGHT_LENGTH}
                    outlineStyle='underscore'
                    idxSplit={constants.ROOM_CODE_LEFT_LENGTH}
                    splitString='-'
                    textId='room-code-text'
                    onSubmit={newRoomCode => {
                        setRoomCode(newRoomCode);
                        setShowUsername(true);
                    }}
                />
            </React.Fragment>}
            
            {/* Enter name */}
            {showUsername && <React.Fragment>
                <h1 id='raised-subtitle'>NAME</h1>
                <form onSubmit={(e) => handleJoin(e, username)}>
                    <input type='text' id='nameInput' autoFocus maxLength={20} value={username} onChange={(e) => handleChange(e)}></input>
                </form>
            </React.Fragment>}

            <Corner corner='tr'>
                <Link className='link-text' to='/create'>To Teacher Mode</Link>
            </Corner>
        </main>
      </>
    );
}

export default Join;