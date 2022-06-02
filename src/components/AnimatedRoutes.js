import React from 'react'
import { Routes, Route, useLocation} from 'react-router-dom';
import Join from '../routes/Join';
import Create from '../routes/Create';
import AdminHome from '../routes/admin/AdminHome';
import PlayerHome from '../routes/player/PlayerHome';

import { AnimatePresence } from 'framer-motion'
function AnimatedRoutes() {
    const location = useLocation();

    return(
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Join />} />
            <Route path='create' element={<Create />} />
            <Route path='/host/:roomCode' element={<AdminHome />} />
            <Route path=':roomCode' element={<PlayerHome/>} />
            {/* <Route path='*' element={<ErrorPage />} */}
            </Routes>
      </AnimatePresence>
    )
}

export default AnimatedRoutes