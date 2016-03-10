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

  let network = new NetworkController(gameState.server, player);
  let input = new InputController();
  let game = new GameController(player);

  function tick (camera, dt) {

    let inputEvents = input.readEvents(inputState, camera);

    let networkEvents = network.readEvents();

    game.readAndWriteEvents(gameState, inputEvents, networkEvents, dt);

    network.writeEvents(inputEvents);
  }


  let root = <Root gameState={gameState} player={player} tick={tick} />;
  ReactDOM.render(root, document.getElementById('root'));
};
