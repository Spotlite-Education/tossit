import React from 'react';
import { Routes, Route, } from 'react-router-dom';
import { SocketContext, socket } from './context/socket';
import Join from './routes/Join';
import Create from './routes/Create';
import AdminHome from './routes/admin/AdminHome';
import PlayerHome from './routes/player/PlayerHome';
import './App.scss';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Routes>
        <Route path='/' element={<Join />} />
        <Route path='create' element={<Create />} />
        <Route path='/host/:roomCode' element={<AdminHome />} />
        <Route path=':roomCode' element={<PlayerHome/>} />
        {/* <Route path='*' element={<ErrorPage />} */}
      </Routes>
    </SocketContext.Provider>
  );
}

export default App;
