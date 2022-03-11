import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import Corner from '../components/Corner';
import { generateCode } from '../util/random';
import { LoadingCircle } from '../components/Loading';
import { SocketContext } from '../context/socket';
import '../styles/Create.scss';

const Create = () => {
    const [loading, setLoading] = React.useState(false);
    const [roomCode, setRoomCode] = React.useState('');
    const [toDashboard, setToDashboard] = React.useState(false);

    const socket = React.useContext(SocketContext);

    const handleClick = () => {
        setLoading(true);
        const randomCode = generateCode(6);
        setRoomCode(randomCode); // ASYNC APPARENTLY ?????? there was issues with state not updating before connecting
        socket.emit('createRoom', randomCode);
        socket.on('successMessage', () => {
            setToDashboard(true);
        });
        setLoading(false);
    }

    if (loading) {
        return (
            <div id='loading'>
                <LoadingCircle speed={1} className='loading-circle' />
                <p className='loading-text'>Hold on tight, we&apos;re creating a room!</p>
            </div>
        );
    }

    if (toDashboard) {
        return <Navigate to={`/host/${roomCode}`} />
    }

    return (
        <main>
            <h1 id='title'>CREATE - IT</h1>
            <button
                className='big-button'
                onClick={() => {
                    handleClick();
                }}
            >
                Create Room
            </button>
            <Corner corner='tr' className='link-box'>
                <Link to='/' className='link-text'>Player Mode</Link>
            </Corner>
        </main>
    );
}

export default Create;
