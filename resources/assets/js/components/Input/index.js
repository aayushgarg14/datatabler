import React from 'react'
import { PersonSharp } from '@material-ui/icons'
import './styles.css'

const TextInput = ({ value, onChange, type, placeholder, isTextArea }) => (
    <div className="InputContainer">
        {!isTextArea ?
            <input
                value={value}
                onChange={onChange}
                className="Input"
                type={type}
                placeholder={placeholder} />
            : <textarea
                className="Input"
                placeholder={placeholder}
                value={value}
                onChange={onChange} />
        }
    </div>
)

export default TextInput