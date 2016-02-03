import {Entity} from 'aframe-react';
import React from 'react';

export default props => (
    <Entity camera wasd-controls look-controls {...props}/>
);
