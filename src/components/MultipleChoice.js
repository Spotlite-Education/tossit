import React from 'react';
import PropTypes from 'prop-types';

const MultipleChoice = ({ labelTextComponent, valueOptions, textOptions, valueState, onChange }) => {
    return (
        <label>
            {labelTextComponent}
        </label>
    );
}
MultipleChoice.propTypes = {
    
};

export default MultipleChoice;