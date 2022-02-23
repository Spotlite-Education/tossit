import React from 'react';
import { Routes, Route, } from 'react-router-dom';
import { SocketContext, socket } from './context/socket';
import Join from './routes/Join';
import Create from './routes/Create';
import Dashboard from './routes/Dashboard';
import './App.scss';

function App() {
  //below code does not work, but add in some way or another
  //socket.on('errorMesssage', message => console.log("ERROR: " + message));
  //socket.on('debugMessage', message => console.log(message));

  return (
    <SocketContext.Provider value={socket}>
      <Routes>
        <Route path='/' element={<Join />} />
        <Route path='create' element={<Create />} />
        <Route path=':roomCode' element={<Dashboard />} />
      </Routes>
    </SocketContext.Provider>
  );
}

export default App;
