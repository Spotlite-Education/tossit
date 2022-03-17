import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({ labelTextComponent, onChange }) => {
    return(
        <label onChange>
            {labelTextComponent}
            <input
                type="text"
                placeholder="Type your question here..."
                onChange={(event) => onChange(event.target.value)}
            />
        </label>
    );
}
TextInput.propTypes = {
    labelTextComponent: PropTypes.element.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default TextInput;