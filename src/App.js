import React from 'react';
import { SocketContext, socket } from './context/socket';
import './App.scss'; 
import AnimatedRoutes from './AnimatedRoutes';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <AnimatedRoutes />
    </SocketContext.Provider>
  );
}

export default App;
