import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import Input from '../components/Input';
import Corner from '../components/Corner';
import { LoadingCircle } from '../components/Loading';
import '../styles/Join.scss';
import { SocketContext } from '../context/socket';

const Join = () => {
    const [roomCode, setRoomCode] = React.useState('');
    const [showUsername, setShowUsername] = React.useState(false);
    const [status, setStatus] = React.useState(''); // Status can be '', 'loading', 'waiting', 'joinTransition', or 'joined'

    const socket = React.useContext(SocketContext);

    const handleJoin = (username) => {
        setStatus('loading');
        socket.emit('joinRoom', { roomCode, username } );

        socket.on('errorMessage', ({ error }) => {
            setStatus('');
            if (error === 'roomCode') {
                // TODO: clear roomCode input
                setShowUsername(false);
            } else if (error === 'username') {
                // TODO: clear username input
            }
        });

        socket.on('joined', () => {
            setStatus('waiting');
        })

        socket.on('startSession', () => {
            setStatus('joinTransition');
        });
    }

    if (status === 'loading') {
        return (
            <div id='loading'>
                <LoadingCircle speed={1} className='loading-circle' />
                <p className='loading-text'>Joining the room...</p>
            </div>
        );
    } else if (status === 'waiting') {
        return (
            <div id='loading'>
                <LoadingCircle speed={1} className='loading-circle' />
                <p className='loading-text'>WAITING FOR START...</p>
            </div>
        );
    } else if (status === 'joinTransition') {
        setTimeout(() => {
            setStatus('joined');
        }, 2000);
        return (
            <h1 id='centered-subtitle'>CREATE A QUESTION!</h1> // TODO: make text animate by moving upwards, and then switch status to joined
        );
    } else if (status === 'joined') {
        return <Navigate to={`/${roomCode}`} />
    }

    return (
      <>
        <main>
            {!showUsername && <React.Fragment>
                <h1 id='title'>TOSS - IT</h1>
                <Input width='22.5%' height='3.5rem' numInputs={6} outlineStyle='underscore' onSubmit={newRoomCode => {
                    setRoomCode(newRoomCode);
                    setShowUsername(true);
                }} />
            </React.Fragment>}
            {showUsername && <React.Fragment>
                <h1 id='raised-subtitle'>NAME</h1>
                <Input width='22.5%' height='3.5rem' numInputs={10} outlineStyle='underscore' onSubmit={handleJoin} /> {/* TODO: use different component than InputBox */}
            </React.Fragment>}

            <Corner corner='tr' className='link-box'>
                <Link className='link-text' to='/create'>Teacher Mode</Link>
            </Corner>
        </main>
      </>
    );
}

export default Join;