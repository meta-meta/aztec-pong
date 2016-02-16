import 'babel-polyfill';
import 'aframe-core';

import React from 'react';
import ReactDOM from 'react-dom';
import {Scene} from 'aframe-react';

import buildInitialGameState from './js/initialGameState';
import gameTick from './js/gameTick';
import App from './js/App';


function render () {
  // App shouldn't mutate gameState
  let scene = <Scene onTick={sceneTick}>
    <App state={gameState} />
  </Scene>;

  ReactDOM.render(scene, document.getElementById('root'));
}


function sceneTick () {
  const prev_t_ms = this.t_ms || Date.now();
  this.t_ms = Date.now();
  let dt_seconds = (this.t_ms - prev_t_ms) / 1000;

  gameTick(gameState, dt_seconds); // gameTick mutates gameState
  render();
}


window.entryPoint = () => {
  var gameState = window.gameState = buildInitialGameState();

  let handleKeyUp = e => gameState.keys[e.keyCode] = false;
  let handleKeyDown = e => gameState.keys[e.keyCode] = true;

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  render();
};
