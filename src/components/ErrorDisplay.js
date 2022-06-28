import React from 'react';
import PropTypes from 'prop-types';
import { BiErrorCircle } from 'react-icons/bi'

const ErrorDisplay = ({ errorMessage, containerStyle }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            backgroundColor: 'rgb(230, 64, 78)',
            borderRadius: '10000rem',
            padding: '0.5rem',
            ...containerStyle
        }}>
            <BiErrorCircle />
            <p style={{ fontSize: '1rem' }}>{errorMessage}</p>
        </div>
    );
}
ErrorDisplay.propTypes = {
    errorMessage: PropTypes.string.isRequired,
    containerStyle: PropTypes.object,
};

export default ErrorDisplay;