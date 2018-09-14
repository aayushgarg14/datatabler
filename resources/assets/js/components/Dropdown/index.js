import React from 'react';
import Select from 'react-select'

import './styles.css'

const Dropdown = ({ text, placeholder, value, onChangeHandler, options }) => {
    return (
        <div className="DropdownContainer">
            <div className="SelectInput">
                <Select
                    name="form-field-name"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChangeHandler}
                    options={options}
                    joinValues={true}
                    wrapperStyle={{ width: '100%' }}
                    clearable={false}
                />
            </div>
        </div>
    );
}

export default Dropdown;
