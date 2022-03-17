import React from 'react';
import PropTypes from 'prop-types';

const FreeResponse = ({ labelTextComponent, onChange }) => {
    return(
        <label onChange={(event) => {
            event.preventDefault();
            onChange(event.target.value);
        }}>
            {labelTextComponent}
            <input
                type="text"
                placeholder="Type your question here..."
                style={{
                    color: 'black',
                }}
            />
        </label>
    );
}
FreeResponse.propTypes = {
    labelTextComponent: PropTypes.element.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default FreeResponse;