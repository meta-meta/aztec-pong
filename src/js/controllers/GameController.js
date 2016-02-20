import _ from 'lodash';

import initialGameState from './js/initialGameState';


export default class GameController {
  constructor (player) {
    this.player = player;
    this.buffer = [];
  }

  readEvents (gameState, inputEvents, networkEvents, dt) {

    // input events: camera-lookat, paddle-move-left, paddle-move-right, reset
    // network events: paddle-move-left, paddle-move-right, reset

    // It doesn't make sense to have both camera moving and paddle left/right at same time,
    // they are conflicting controls.


    // Speculatively apply the new state in a transaction.
    // Run business logic, hit detection, out of bounds rules.
    // Any rule that triggers a state change (e.g. ball changes color) is an event.




    // Speculate what events would happen given these inputs.



    let dispatch = {
      'camera-lookat': (player, position, direction) => {
        // either our local event, or their network event, doesn't matter.
        let mypaddle = player === '1' ? gameState.paddle1 : gameState.paddle2;
        mypaddle.z = PaddleZFromLookat(player, position, direction);

        // Given this new state, are there any game events?
        // Paddle hit, out of bounds.

        // Generate

      },
      'reset': () => {
        // early return - if someone requests a reset, no other events should be processed or broadcasted
      }
    };


    // Did the camera move the paddle to a position, which hit the ball? Speculatively find out now

    // figure out what the current state is and what game events have now happened
    // as a result of these input and network events
    // return list of game events

    // Turn the input events into game events (which will be broadcasted and applied locally)
    let gameEvents = _.map(inputEvents, event => dispatch[event.type].apply(this, event.args));

    this.buffer.push(gameEvents);

    // Network events are applied locally but not broadcasted
    let localGameEvents = _.map(inputEvents, event => dispatch[event.type].apply(this, event.args));








    // moved paddle1, paddle2 (from ui or network)
    // will their new positions
    //  - generate a hit? paddle or wall
    //  - out of bounds
    //  - out of arena

    //let event = {player: this.player, type: 'reset'};
    //let event = {player: this.player, type:'paddle', args: [newPos]};


    // List of events that happened this tick
    // Paddle moved to XYZ.
    // Paddle1 hit ball, ball velocity changed.
      // {PLAYER: ME, type: paddle-hit-ball, args:[ballVel]}
    // Ball out of bounds
    // Game state reset.
    // Ball moved to new coordinates

    // (need to make sure it is consistent - e.g. if reset was pressed, drop other events.
    // If they are consistent, the order doesn't matter i think.)
    // Not all events need be broadcasted over network. We can filter the event stream
    // to only send certain events. But

    return this.buffer.splice(0, this.buffer.length);
  }

  writeEvents (gameState, gameEvents) {
    // Write the events to the state.
    // Everything must come through an event.
    // This guarantees a complete understanding of all state transitions at any tick.

    // All local events are also broadcasted over network.
    // So, we already saw the ball go out of bounds 100ms ago, and now the network message says
    // the ball was hit. Always trust the network.
    // So if they say they hit it, believe them, clobber our state here.


    // Write through to the gamestate.
    let dispatch = {
      'paddle-move-left': (player, newPos) => gameState[`paddle${this.player}`].pos.z = newPos,
      'reset': (player) => Object.assign(gameState, initialGameState()),
      'camera-lookat': (player, position, direction) => {
        let mypaddle = player === '1' ? gameState.paddle1 : gameState.paddle2;
        mypaddle.z = PaddleZFromLookat(player, position, direction);
      },
      outOfBounds: (player) => null,
      outOfArena: (player) => null
    };

    _.each(gameEvents, event =>
        dispatch[event.type].apply(this, [event.player].concat(event.args)));
  }
}



function PaddleZFromLookat (player, position, direction) {
  let ray = new THREE.Ray(position, direction);
  let w = gameState.arena.width / 2;
  let plane = new THREE.Plane(
      new THREE.Vector3(player === '1' ? 1 : -1, 0, 0),
      w);
  let intersectAt = ray.intersectPlane(plane);

  let mypaddle = player === '1' ? state.paddle1 : state.paddle2;
  let paddleZ = intersectAt ? intersectAt.z : mypaddle.pos.z;
  return THREE.Math.clamp(paddleZ, -w, w);
}



function hitPaddle () {
  let {velocity, ball, paddle1, paddle2, arena, keys} = state;
  let {y, z, r, rotation} = ball;

  let isCollision = paddle => Math.abs(paddle.pos.z - ball.z) < (paddle.width / 2 + ball.r);

  let hitPaddle1 = () => {
    let ballEdge = ball.x - ball.r;
    let strikingSurface = paddle1.pos.x + (paddle1.depth / 2);
    let backSurface = paddle1.pos.x - (paddle1.depth / 2);

    if (ballEdge < strikingSurface && ballEdge > backSurface && isCollision(paddle1)) {
      velocity.x = Math.abs(velocity.x);
    }
  };

  let hitPaddle2 = () => {
    let ballEdge = ball.x + ball.r;
    let strikingSurface = paddle2.pos.x - (paddle2.depth / 2);
    let backSurface = paddle2.pos.x + (paddle2.depth / 2);

    if (ballEdge > strikingSurface && ballEdge < backSurface && isCollision(paddle2)) {
      velocity.x = -1 * Math.abs(velocity.x);
    }
  };
  hitPaddle1();
  hitPaddle2();
}



function hitWall (dt) {
  let {velocity, ball, paddle1, paddle2, arena, keys} = state;
  let {y, z, r, rotation} = ball;

  //hit wall
  if (ball.z - ball.r < -arena.width/2) {
    velocity = Object.assign({}, velocity, {z: Math.abs(velocity.z)});
  }
  if (ball.z + ball.r > arena.width/2) {
    velocity = Object.assign({}, velocity, {z: -1 * Math.abs(velocity.z)});
  }

  let out_of_arena = Math.abs(ball.x) > 23/2;
  if (out_of_arena) {
    state.lightColor= "#0f0";
    state.ball = {x: 0, y, z, r, rotation};
  } else {
    let out_of_bounds = Math.abs(ball.x) > arena.width/2;
    if (out_of_bounds) {
      state.lightColor = "#f00";
    }
    state.ball.x += dt * velocity.x;
    state.ball.y += dt * velocity.y;
    state.ball.z += dt * velocity.z;
    state.ball.r = r;
    state.ball.rotation += 360 * dt;
    state.t += dt;
    state.velocity = velocity;
  }
}


function MovePaddles () {
  const mypaddle = player === '1' ? state.paddle1 : state.paddle2;
  // keyboard controls to move paddles
  const dPaddle = 10 * dt_seconds;
  if (keys[38] && mypaddle.pos.z - mypaddle.width/2 >= -arena.width/2) {
    mypaddle.pos.z -= dPaddle;
    //state.paddle2.pos.z = paddle2.pos.z + dPaddle;
  }
  if (keys[40] && mypaddle.pos.z + mypaddle.width/2 <= arena.width/2) {
    mypaddle.pos.z += dPaddle;
    //state.paddle2.pos.z = paddle2.pos.z - dPaddle;
  }


  const w = state.arena.width / 2;
  var paddleZ = intersectAt ? intersectAt.z : mypaddle.pos.z;
  paddleZ = THREE.Math.clamp(paddleZ, -w, w);

  let event = {player: player, type: 'paddle', args: [paddleZ]};
  mypaddle.pos.z = paddleZ;
}