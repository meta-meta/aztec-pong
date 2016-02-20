import './js/monkeypatches';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';


import initialGameState from './js/initialGameState';
import NetworkController from './js/controllers/NetworkController';
import GameController from './js/controllers/GameController';
import InputController from './js/controllers/InputController';
import Root from './js/Root';


window.entryPoint = () => {
  var player = window.location.search.substr(1);  // http://localhost:8080/?1

  var gameState = initialGameState();
  var inputState = {keys: {}};

  let network = new NetworkController();
  let input = new InputController(player);
  let game = new GameController(player);

  function tick (camera, dt_seconds) {

    let inputEvents = input.readEvents(inputState, camera);

    let networkEvents = network.readEvents();

    // Game is a function of our inputs and their inputs.
    let gameEvents = game.readEvents(gameState, inputEvents, networkEvents, dt_seconds);

    // Broadcast our inputs, so they can play them forward.
    network.writeEvents(inputEvents);

    // Broadcast what we think happened. We should eventually receive equiv events from them confirming that they saw it too.
    //network.writeEvents(gameEvents);

    // Play our game events locally.
    game.writeEvents(gameState, gameEvents);
  }


  let root = <Root gameState={gameState} player={player} tick={tick} />;
  ReactDOM.render(root, document.getElementById('root'));
};
