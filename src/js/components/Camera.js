import {Entity} from 'aframe-react';
import React from 'react';

export default props => (
  <Entity position={`0 ${props.y + 15} 15`} rotation={`-60 0 0`}>
    <Entity camera look-controls wasd-controls {...props}/>
  </Entity>
);
