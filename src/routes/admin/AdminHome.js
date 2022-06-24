import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext } from '../../context/socket';
import '../../styles/admin/AdminHome.scss';
import AdminJoin from './AdminJoin';
import AdminPlay from './AdminPlay';
import Leaderboard from '../Leaderboard';

const AdminHome = () => {
    const socket = React.useContext(SocketContext);
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        socket.emit('checkEnterAdminHome', params.roomCode);
        socket.on('checkFail', ({ message }) => {
            console.log('ERROR ACCESSING ADMIN HOME: ' + message);
            navigate('/');
            return;
        });

        // TODO: use callback and do useeffect cleanup for checkFail listener
    }, []);

    const [status, setStatus] = React.useState('join');
    const [players, setPlayers] = React.useState([]);

    const handlePlayersChanged = React.useCallback(newPlayers => {
        const sortedPlayers = newPlayers.sort((a, b) => a.username.localeCompare(b.username)); // NOTE: sort to maintain order, otherwise toss shuffles order
        // TODO: sort by time joined instead of username
        setPlayers(sortedPlayers);
    });

    React.useEffect(() => {
        socket.on('playersChanged', handlePlayersChanged);

        return () => {
            socket.off('playersChanged', handlePlayersChanged);
        }
    }, [socket]);

    switch(status) {
        default:
        case 'join':
            return <AdminJoin
                players={players}
                setPlayers={setPlayers}
                handleStart={() => setStatus('play')}
            />;
        case 'play':
            return <AdminPlay
                players={players}
                openLeaderboard={() => setStatus('leaderboard')}
            />;
        case 'leaderboard':
            return <Leaderboard
                players={players}
            />;
    }
}

export default AdminHome;