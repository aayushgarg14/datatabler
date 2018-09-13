import React from 'react'
import { PersonSharp } from '@material-ui/icons'
import './styles.css'

const TextInput = ({ value, onChange, type, placeholder }) => (
    <div className="InputContainer">
        <span className="InputIcon"><PersonSharp /></span>
        <input 
        value={value}
        onChange={onChange}
        className="Input" 
        type={type}
        placeholder={placeholder} />
    </div>
)

export default TextInput