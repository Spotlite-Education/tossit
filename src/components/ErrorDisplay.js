import React from 'react';
import PropTypes from 'prop-types';
import { BiErrorCircle } from 'react-icons/bi'

const ErrorDisplay = ({ errorMessage, containerStyle=null }) => {
    return (
        <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '1.5rem',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            backgroundColor: 'rgb(230, 64, 78)',
            borderRadius: '10000px',
            padding: '0.5rem',
            paddingRight: '1rem',
            ...containerStyle
        }}>
            <BiErrorCircle size='1.5rem' />
            <p style={{ fontSize: '1rem' }}>{errorMessage}</p>
        </div>
    );
}
ErrorDisplay.propTypes = {
    errorMessage: PropTypes.string.isRequired,
    containerStyle: PropTypes.object,
};

export default ErrorDisplay;