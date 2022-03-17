import React from 'react';
import PropTypes from 'prop-types';

const Choice = ({ text }) => {
    return (
        <input type='radio' value={text} />
    );
}
Choice.propTypes = {
    text: PropTypes.string.isRequired,
};

const MultipleChoice = ({ labelTextComponent, options, optionState, onChange }) => {
    return (
        <label onChange={(event) => onChange(event.target.value)}>
            {labelTextComponent}
            {options.map((option, index) => {
                return <Choice
                    key={index}
                    text={option}
                />;
            })}
        </label>
        // TODO: allow for adding/deleting multiple choice options only for question creation
        // TODO: each option is an input text field only for question creation
    );
}
MultipleChoice.propTypes = {
    labelTextComponent: PropTypes.element.isRequired,
};

export default MultipleChoice;