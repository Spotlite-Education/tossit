import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Loading.scss';

export const LoadingPlane = ({ speed, className }) => {
    return (
        <div className={className + ' loading-plane'}
            style={{ animationDuration: `${speed}s` }}>
            
            <img src = "/images/plane.png" alt = ""/>
        </div>
    );
}

LoadingPlane.propTypes = {
    speed: PropTypes.number,
    className: PropTypes.string,
}