import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './routes/Home';
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

    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="about" element={<About />} />
      </Routes>
    </div>
  );
}

function About() {
  return (
    <>
      <main>
        <h2>Who are we?</h2>
        <p>
          bruh
        </p>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}

export default App;
