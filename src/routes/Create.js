import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import Corner from '../components/Corner';
import { SocketContext } from '../context/socket';
import '../styles/Create.scss';
import CombinedLogo from '../assets/images/logocombined.svg';
import { TossPlanes } from '../components/TossPlanes';

const Create = () => {
    const [loading, setLoading] = React.useState(false);
    const [roomCode, setRoomCode] = React.useState('');
    const [toHome, setToHome] = React.useState(false);

    const socket = React.useContext(SocketContext);

    const handleClick = () => {
        setLoading(true);
        socket.emit('createRoom');
        socket.once('successMessage', roomCode => {
            setRoomCode(roomCode);
            setLoading(false);
            setToHome(true);
        });
    }

    if (loading) {
        return (
            <div id='loading'>
                <TossPlanes />
                <p className='loading-text'>Hold on tight, we&apos;re creating a room!</p>
            </div>
        );
    }

    if (toHome) {
        return <Navigate to={`/host/${roomCode}`} />
    }

    return (
        <main>
            
            <img src={CombinedLogo} className='logo' />
            <p style={{
                position: 'absolute',
                fontSize: '1.2rem',
                fontFamily: 'Sans-Regular',
                top: '52%',
                left: '50%',
                transform: 'translate(-50%, 0%)',
            }}>Teacher Mode</p>
            <button
                style= {{
                    left: '50%',
                    top: '63%',
                }}
                className='big-button'
                onClick={() => {
                    handleClick();
                }}
            >
                Create Room
            </button>
            <Corner corner='tr'>
                <Link to='/' className='link-text'>To Player Mode</Link>
            </Corner>
        </main>
    );
}

export default Create;
