import React from 'react';
import { Routes, Route, } from 'react-router-dom';
import { SocketContext, socket } from './context/socket';
import Join from './routes/Join';
import Create from './routes/Create';
import Dashboard from './routes/Dashboard';
import StudentDashboard from './routes/StudentDashboard';
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
        <Route path=':room' element={<StudentDashboard/>} />
      </Routes>
    </SocketContext.Provider>
  );
}

export default App;
