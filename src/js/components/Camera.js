import {Entity} from 'aframe-react';
import React from 'react';

export default props => (
  <Entity position={`0 ${props.y + 7} 0`}>
    <Entity camera look-controls wasd-controls {...props}/>
  </Entity>
);
