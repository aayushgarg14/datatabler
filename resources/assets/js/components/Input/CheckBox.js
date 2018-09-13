import React, { Component } from 'react';

import classes from './styles.css'

class Checkbox extends Component {
    state = {
        isChecked: false,
    }

    toggleCheckboxChange = () => {
        const { handleCheckboxChange, label } = this.props;

        this.setState(({ isChecked }) => (
            {
                isChecked: !isChecked,
            }
        ));

        handleCheckboxChange(label);
    }

    render() {
        const { label } = this.props;
        const { isChecked } = this.state;

        return (
            <div className={classes.CheckBox}>
                <label>
                    <input
                        type="checkbox"
                        value={label}
                        checked={isChecked}
                        onChange={this.toggleCheckboxChange}
                    />
                    {label}
                </label>
            </div>
        );
    }
}

// Checkbox.propTypes = {
//     label: PropTypes.string.isRequired,
//     handleCheckboxChange: PropTypes.func.isRequired,
// };

export default Checkbox;