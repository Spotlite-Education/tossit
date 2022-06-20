import React from 'react';
import '../styles/Loading.scss';
import plane from '../assets/images/plane.svg';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion'

export const TossPlanes = () => {
    return (
        <>
        <motion.div
            animate={{
                opacity: [0, 1, 1, 0],
               y: [10, -30],
               x: [-150, 150],
               rotate: [-5, 10]
            }}
            transition= {{
                duration: 2,
                repeat: Infinity,
                opacity: {
                    duration: 2,
                    times: [0, 0.4, 0.6, 1],
                    repeat: Infinity,
                },
            }} 
        >
            <div className='loading-plane-small'>            
                <img src = {plane} alt = "plane"/>
            </div>
        </motion.div>

        <motion.div
            animate={{
                opacity: [0, 1, 1, 0],
                y: [-30, 10],
                x: [150, -150],
                rotate: [-190, -195]
            }}
            transition= {{
                duration: 2,
                repeat: Infinity,
                opacity: {
                    duration: 2,
                    times: [0, 0.4, 0.6, 1],
                    repeat: Infinity,
                },
            }} 
            >
            <div className='loading-plane-small'>            
                <img style = {{
                    transform: 'scaleY(-1)'
                }}
                src = {plane} alt = "plane"/>
            </div>
        </motion.div>
        </>
    );
}

TossPlanes.propTypes = {
    speed: PropTypes.number,
    className: PropTypes.string,
}