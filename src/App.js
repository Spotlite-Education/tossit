import React from 'react';
import { Routes, Route, } from 'react-router-dom';
import { SocketContext, socket } from './context/socket';
import Join from './routes/Join';
import Create from './routes/Create';
import TeacherDashboard from './routes/TeacherDashboard';
import StudentDashboard from './routes/StudentDashboard';
import './App.scss';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Routes>
        <Route path='/' element={<Join />} />
        <Route path='create' element={<Create />} />
        <Route path='/host/:roomCode' element={<TeacherDashboard />} />
        <Route path=':roomCode' element={<StudentDashboard/>} />
        {/* <Route path='*' element={<ErrorPage />} */}
      </Routes>
    </SocketContext.Provider>
  );
}

export default App;
