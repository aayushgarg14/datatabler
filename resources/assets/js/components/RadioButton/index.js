import React from 'react'

import './styles.css'

const RadioButton = ({text}) => (
    <div className="pretty p-default p-curve">
        <input value={text} type="radio" name="radio1" />
        <div className="state p-primary-o">
            <label className="RadioText">{text}</label>
        </div>
    </div>
)

export default RadioButton