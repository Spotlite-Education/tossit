import React from 'react';
import PropTypes from 'prop-types';

const FreeResponse = ({ labelTextComponent, onChange, placeholder }) => {
    return(
        <label onChange={(event) => {
            event.preventDefault();
            onChange(event.target.value);
        }}>
            {labelTextComponent}
            <input
                type="text"
                placeholder={placeholder}
                style={{
                    minWidth: '30rem',
                    minHeight: '2.5rem',
                    marginBottom: '1.5rem',
                    outline: 'none',
                    color: 'black',
                    fontFamily: 'Jost-Book',
                    fontSize: '1rem',
                }}
            />
        </label>
    );
}
FreeResponse.propTypes = {
    labelTextComponent: PropTypes.element.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
};

export default FreeResponse;