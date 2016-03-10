import _ from 'lodash';

import initialGameState from '../initialGameState';


export default class GameController {
  constructor (player) {
    this.player = player;
    this.buffer = [];
  }

  readAndWriteEvents (gameState, inputEvents, networkEvents, dt) {


    let inputEventsWithPlayer = _.map(inputEvents,
        event => _.extend(event, {player: this.player}));

    // first phase - figure out new gameState before collisions

    let allEventsWithPlayer = [].concat(inputEvents, networkEvents);

    _.each(allEventsWithPlayer, event => {
      if (event.type === 'reset') {
        Object.assign(gameState, initialGameState());
        return;
      }

      if (event.type ==='camera-lookat') {
        let position = V3().fromArray(event.args[0]);
        let direction = V3().fromArray(event.args[1]);
        // either our local event, or their network event, doesn't matter.
        let mypaddle = event.player === '1' ? gameState.paddle1 : gameState.paddle2;
        mypaddle.pos.z = PaddleZFromLookat(gameState, event.player, position, direction);
      }
    });
  }
}



function PaddleZFromLookat (gameState, player, position, direction) {
  let ray = new THREE.Ray(position, direction);
  let w = gameState.arena.width / 2;
  let plane = new THREE.Plane(
      new THREE.Vector3(player === '1' ? 1 : -1, 0, 0),
      w);
  let intersectAt = ray.intersectPlane(plane);

  let mypaddle = player === '1' ? gameState.paddle1 : gameState.paddle2;
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