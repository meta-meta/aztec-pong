import 'babel-polyfill';
import 'aframe-core';

import React from 'react';
import ReactDOM from 'react-dom';
import {Scene} from 'aframe-react';
import WebSocket from 'ws';

import buildInitialGameState from './js/initialGameState';
import gameTick from './js/gameTick';
import App from './js/App';
import NetworkController from './js/NetworkController';



var camera = null;
var gameState = null;
var networkController = null;
var player = null;


let attachToCamera = (cmp) => {
  let el = ReactDOM.findDOMNode(cmp);
  camera = el.components.camera.camera;
};


function render (player) {
  // App shouldn't mutate gameState
  let reactApp = <div>
    <Scene onTick={sceneTick}>
      <App state={gameState}
           player={player}
           cameraRef={attachToCamera} />
    </Scene>
    <pre style={{position: 'absolute', zIndex: 1}}>{JSON.stringify(gameState, null, 2)}</pre>
  </div>;

  ReactDOM.render(reactApp, document.getElementById('root'));
}


function sceneTick () {
  const prev_t_ms = this.t_ms || Date.now();
  this.t_ms = Date.now();
  let dt_seconds = (this.t_ms - prev_t_ms) / 1000;

  gameTick(gameState, camera, networkController, player, dt_seconds); // gameTick mutates gameState
  render(player);
}

THREE.Vector3.prototype.toAframeString = function() {return `${this.x} ${this.y} ${this.z}`};
window.V3 = (x, y, z) => new THREE.Vector3(x, y, z);
window.V3toStr = (x, y, z) => V3(x, y, z).toAframeString();

window.entryPoint = () => {
  gameState = buildInitialGameState();
  player = window.location.search.substr(1);  // http://localhost:8080/?1
  networkController = new NetworkController(player, gameState);


  let handleKeyUp = e => gameState.keys[e.keyCode] = false;
  let handleKeyDown = e => gameState.keys[e.keyCode] = true;

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  render(player);
};
