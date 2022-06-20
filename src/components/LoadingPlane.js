import React from 'react';
import '../styles/Loading.scss';
import plane from '../assets/images/plane.svg';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion'

export const LoadingPlane = () => {
    return (
        <motion.div
            animate={{
               y: [0, 40, 0],
               rotate: [10, 5, 10]
            }}
            transition= {{
                duration: 4,
                repeat: Infinity
            }} 
        >
            <div className='loading-plane-big'>            
                <img src = {plane} alt = "plane"/>
            </div>
        </motion.div>
    );
}

LoadingPlane.propTypes = {
    speed: PropTypes.number,
    className: PropTypes.string,
}