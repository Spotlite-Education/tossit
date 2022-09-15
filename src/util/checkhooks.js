import React from 'react';
import { useNavigate } from 'react-router-dom';

export const useCheckRoomExists = (socket) => {
    const navigate = useNavigate();

    const handleError = React.useCallback(({ error, message }) => {
        if (error === 'nullroom')
        {
            console.log('ERROR: ' + message);
            navigate(0);
        }
    }, []);

    React.useEffect(() => {
        socket.on('errorMessage', handleError);

        return () => {
            socket.off('errorMessage', handleError);
        };
    }, [socket]);
}