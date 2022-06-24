import React from 'react';
import { SocketContext, socket } from './context/socket';
import { BrowserRouter } from 'react-router-dom';
import './App.scss'; 
import AnimatedRoutes from './AnimatedRoutes';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
