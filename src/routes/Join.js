import React from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Corner from '../components/Corner';
import '../styles/Join.scss';
import { SocketContext } from '../context/socket';

const Join = () => {
    const [waiting, setWaiting] = React.useState(false);
    const [showUsername, setShowUsername] = React.useState(false);
    const [roomCode, setRoomCode] = React.useState("");

    const socket = React.useContext(SocketContext);

    const handleJoin = (username) => {
        setWaiting(true);
        socket.emit('joinRoom', { roomCode, username } );

        // TODO: check is join connection is actually successful before setting waiting to true.
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
                <h1 id='subtitle'>Username</h1>
                <Input width='22.5%' height='3.5rem' numInputs={10} outlineStyle='underscore' onSubmit={handleJoin} /> {/* TODO: use different component than InputBox */}
            </React.Fragment>}

            <Corner corner='tr' className='link-box'>
                <Link className='link-text' to='/create'>Teacher Mode</Link>
            </Corner>
        </main>
        {waiting &&
            <div id='loading'>
                <p id='loading-text'>Waiting...</p>
            </div>
        }
      </>
    );
}

export default Join;