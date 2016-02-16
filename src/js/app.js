import _ from 'lodash';
import React from 'react';
import {Animation, Entity, Scene} from 'aframe-react';

import rgbToHex from './util/rgb2hex.js';

import Camera from './components/Camera';
import Cursor from './components/Cursor';
import Light from './components/Light';
import Sky from './components/Sky';
import Arena from './components/Arena';
import Ball from './components/Ball';
import Cloud from './components/Cloud';
import Paddle from './components/Paddle';
import Temple from './components/Temple';



let App = (props) => {
  let {state} = props;
  let {ball} = state;
  let {paddle1, paddle2, elevation} = state;

  return (
      <Entity>
        <Entity position={`0 ${elevation + 8} 10`}>
          <Camera>{/*<Cursor/>*/}</Camera>
        </Entity>
        <Sky/>

        {/*Light doesn't know what to do with the position component for some reason*/}
        <Light type="ambient" color="#666"/>
        <Light type="point" intensity="1" color="#766"/>
        <Light type="point" intensity="2" distance="20" color={state.lightColor}/>

        <Temple position={`0 -40 56`}/>

        <Cloud position={`4 80 3`} scale={2} />
        <Cloud position={`-5 20 -2`} scale={0.5} />
        <Cloud position={`7 30 -5`} scale={0.5} />
        <Cloud position={`7 50 -5`} scale={0.5} />

        <Arena position={`0 -0.4 0`} width={state.arena.width} height={0.1} depth={state.arena.depth} />

        <Paddle position={`${paddle1.pos.x} ${paddle1.pos.y} ${paddle1.pos.z}`}
                width={paddle1.width}
                height={paddle1.height}
                depth={paddle1.depth}
                color="#faa"/>
        <Paddle position={`${paddle2.pos.x} ${paddle2.pos.y} ${paddle2.pos.z}`}
                width={paddle2.width}
                height={paddle2.height}
                depth={paddle2.depth}
                color="#aaf"/>

        <Ball position={`${ball.x} ${ball.y} ${ball.z}`} rotation={`0 ${ball.rotation} 0`} radius={ball.r} />
      </Entity>
  );
};

export default App;
