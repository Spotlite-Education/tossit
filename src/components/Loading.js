import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Loading.scss';

export const LoadingCircle = ({ speed, className }) => {
    return (
        <div
            className={className + ' loading-circle'}
            style={{ animationDuration: `${speed}s` }}
        />
    );
}

LoadingCircle.propTypes = {
    speed: PropTypes.number,
    className: PropTypes.string,
}
