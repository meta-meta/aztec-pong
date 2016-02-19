import React from 'react';
import {Entity} from 'aframe-react';


let Paddle = (props) => {
  const {width, height, depth, color} = props;
  return (
      <Entity geometry={{primitive: 'box', width, height, depth}}
              material={{color}}
              position={props.position}
              rotation="0 90 0" />
  );
};

export default Paddle;
