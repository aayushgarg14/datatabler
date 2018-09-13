import React from 'react';

import './styles.css';

const Backdrop = (props) => {
  return (
    props.show
      ? (
        <div
          className="Backdrop"
          style={{ ...props }}
          onClick={props.clicked}>
        </div>)
      : null
  )
};

export default Backdrop
