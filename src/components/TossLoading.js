import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Loading.scss';

export const LoadingPlane = ({ speed, className }) => {
    return (
        <div
            className={className + ' loading-plane'}
            style={{ animationDuration: `${speed}s` }}
        />
    );
}

LoadingPlane.propTypes = {
    speed: PropTypes.number,
    className: PropTypes.string,
}