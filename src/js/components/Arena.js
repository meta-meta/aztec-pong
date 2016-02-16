import React from 'react';
import {Entity} from 'aframe-react';


let Arena = (props) => {
  const {width, height, depth} = props;
  return (
      <Entity geometry={{primitive: 'box', width, height, depth}}
              material={{color: '#fff'}}
              position={props.position}
              rotation="0 90 0" />
  );
};

export default Arena;
