import React from 'react';
import {Entity} from 'aframe-react';

let Temple = (props) =>
    <Entity loader={{src: 'url(models/model_scene-temple_04.dae)', format: 'collada'}}
            rotation={`0 180 0`}
            position={props.position} />;

export default Temple;
