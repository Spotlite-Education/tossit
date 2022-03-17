import React from 'react';
import PropTypes from 'prop-types';

const Option = ({ value, text }) => {
    return (
        <option value={value}>{text}</option>
    );
}
Option.propTypes = {
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

const Dropdown = ({ labelTextComponent, valueOptions, textOptions, valueState, onChange }) => {
    return (
        <label>
            {labelTextComponent}
            <select value={valueState} onChange={(event) => onChange(event.target.value)}>
                {valueOptions.map((value, index) => {
                    return <Option
                        key={index}
                        value={value}
                        text={textOptions[index]}
                    />;
                })}
            </select>
        </label>
    );
}
Dropdown.propTypes = {
    labelTextComponent: PropTypes.element.isRequired,
    valueOptions: PropTypes.array.isRequired,
    textOptions: PropTypes.array.isRequired,
    valueState: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Dropdown;