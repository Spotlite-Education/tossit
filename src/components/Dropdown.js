import React from 'react';
import PropTypes from 'prop-types';

const Option = ({ value, text }) => {
    return (
        <option value={value} style={{
            color: 'black',
        }}>{text}</option>
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
            <select value={valueState} onChange={onChange} style={{
                color: 'black',
                height: 60, 
                width: 300,
                textAlign: 'center',
                fontSize: 25,
                fontFamily: 'Jost-Book',
                padding: 5,
            }}>
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