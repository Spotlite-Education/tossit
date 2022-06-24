import { io } from 'socket.io-client';
import React from 'react';

const SOCKET_URL = 'https://tossit-server.herokuapp.com';

const socket = io(SOCKET_URL);
socket.on('debugMessage', (props) => console.log("DEBUG: " + props.message));
socket.on('errorMessage', (props) => console.log("ERROR: " + props.message)); // TODO: socket.off these and allListeners in the end
export { socket };

export const SocketContext = React.createContext();