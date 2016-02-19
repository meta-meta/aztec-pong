import React from 'react';
import {Entity} from 'aframe-react';


let Ball = (props) =>
    <Entity geometry={{primitive: 'sphere', radius: props.radius}}
            material={{color: props.color, src: 'url(images/hazard.png)'}}
            position={props.position}
            rotation={props.rotation} />;

export default Ball;
