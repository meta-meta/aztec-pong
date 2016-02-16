import React from 'react';
import {Entity} from 'aframe-react';


let Cloud = (props) =>
    <Entity loader={{src: 'url(models/model_cloud_01.dae)', format: 'collada'}}
            material={{color: '#fff', transparent: true, opacity: 0.2}}
            rotation={`0 180 0`}
            scale={`${props.scale} ${props.scale} ${props.scale}`}
            position={props.position} />;

export default Cloud;
