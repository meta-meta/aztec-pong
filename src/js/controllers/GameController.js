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

    let {ball, arena, paddle1, paddle2} = gameState;

    //hit wall
    if (ball.position.z - ball.r < -arena.width / 2) {
      ball.velocity.z = Math.abs(ball.velocity.z);
    }
    if (ball.position.z + ball.r > arena.width / 2) {
      ball.velocity.z = -1 * Math.abs(ball.velocity.z);
    }

    let out_of_arena = Math.abs(ball.position.x) > 23 / 2;
    if (out_of_arena) {
      gameState.lightColor = "#0f0";
      ball.position.x = 0;
    } else {
      let out_of_bounds = Math.abs(ball.position.x) > arena.width / 2;
      if (out_of_bounds) {
        gameState.lightColor = "#f00";
      }

      const dPos = V3().copy(ball.velocity).multiplyScalar(dt);
      ball.position.add(dPos);
      gameState.ball.rotation += 360 * dt;
    }


    let isCollision = paddle => Math.abs(paddle.pos.z - ball.position.z) < (paddle.width / 2 + ball.r);

    let hitPaddle1 = () => {
      let ballEdge = ball.position.x - ball.r;
      let strikingSurface = paddle1.pos.x + (paddle1.depth / 2);
      let backSurface = paddle1.pos.x - (paddle1.depth / 2);

      if (ballEdge < strikingSurface && ballEdge > backSurface && isCollision(paddle1)) {
        ball.velocity.x = Math.abs(ball.velocity.x);
      }
    };

    let hitPaddle2 = () => {
      let ballEdge = ball.position.x + ball.r;
      let strikingSurface = paddle2.pos.x - (paddle2.depth / 2);
      let backSurface = paddle2.pos.x + (paddle2.depth / 2);

      if (ballEdge > strikingSurface && ballEdge < backSurface && isCollision(paddle2)) {
        ball.velocity.x = -1 * Math.abs(ball.velocity.x);
      }
    };
    hitPaddle1();
    hitPaddle2();

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




