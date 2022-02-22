import React, { useState, useEffect } from 'react';
import { Routes, Route, } from 'react-router-dom';
import Home from './routes/Home';
import Create from './routes/Create';
import './App.scss';
import { io } from 'socket.io-client';

const serverURL = "http://localhost:8000"; // TODO: change to heroku app URL later

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(serverURL);
    setSocket(newSocket);

    newSocket.on('debugMessage', message => {
      console.log(message);
    });

    return () => {
        console.log('disconnecting from socket');
        newSocket.close();
    };
  }, [setSocket]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="create" element={<Create />} />
      </Routes>
    </div>
  );
}

export default App;
