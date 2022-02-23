import React from 'react';
import { Routes, Route, } from 'react-router-dom';
import { SocketContext, socket } from './context/socket';
import Home from './routes/Home';
import Create from './routes/Create';
import Dashboard from './routes/Dashboard';
import './App.scss';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='create' element={<Create />} />
        <Route path=':roomCode' element={<Dashboard />} />
      </Routes>
    </SocketContext.Provider>
  );
}

export default App;
