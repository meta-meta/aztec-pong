import _ from 'lodash';
import React from 'react';
import {Entity} from 'aframe-react';

import Cursor from './components/Cursor';
import Light from './components/Light';
import Sky from './components/Sky';
import Arena from './components/Arena';
import Ball from './components/Ball';
import Paddle from './components/Paddle';


let Scene = props => {
  let {state} = props;
  let {ball} = state;
  let {paddle1, paddle2} = state;

  return (
      <Entity>
        <Entity position={`${props.player === '1' ? -11 : 11} 0.5 0`}
                rotation={`0 ${props.player === '1' ? -90 : 90} 0`}>
          <Entity ref={props.cameraRef} camera wasd-controls no-click-look-controls={{maxyaw: 1.5}}>
            <Cursor />
          </Entity>
        </Entity>
        <Sky/>

        {/*Light doesn't know what to do with the position component for some reason*/}
        <Light type="ambient" color="#666"/>
        <Light type="point" intensity="1" color="#766"/>
        <Light type="point" intensity="2" distance="20" color={state.lightColor}/>

        <Arena position={`0 -0.4 0`} width={state.arena.width} height={0.1} depth={state.arena.depth} />

        <Paddle position={`${paddle1.pos.x} ${paddle1.pos.y} ${paddle1.pos.z}`}
                width={paddle1.width}
                height={paddle1.height}
                depth={paddle1.depth}
                color="#f00"/>
        <Paddle position={`${paddle2.pos.x} ${paddle2.pos.y} ${paddle2.pos.z}`}
                width={paddle2.width}
                height={paddle2.height}
                depth={paddle2.depth}
                color="#00f"/>

        <Ball position={`${ball.x} ${ball.y} ${ball.z}`} rotation={`0 ${ball.rotation} 0`} radius={ball.r} />
      </Entity>
  );
};

export default Scene;
