import socketio from 'socket.io-client';
import React from 'react';

const SOCKET_URL = 'http://localhost:8000'; //'https://tossit-server.herokuapp.com/';

const socket = socketio.connect(SOCKET_URL);
socket.on('debugMessage', (props) => console.log("DEBUG: " + props.message));
socket.on('errorMessage', (props) => console.log("ERROR: " + props.message));
export { socket };

export const SocketContext = React.createContext();