import React from 'react';
import { Routes, Route, } from 'react-router-dom';
import { SocketContext, socket } from './context/socket';
import Join from './routes/Join';
import Create from './routes/Create';
import Dashboard from './routes/Dashboard';
import './App.scss';

function App() {
  socket.on('debugMessage', (props) => console.log("DEBUG: " + props.message));
  socket.on('errorMessage', (props) => console.log("ERROR: " + props.message));

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
