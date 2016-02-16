import _ from 'lodash';


export default function gameTick (state, dt_seconds) {
  let {t, velocity, ball, paddle1, paddle2, arena, elevation, elevationVel, keys} = state;
  let {x, y, z, r, rotation} = ball;

  let isCollision = paddle => Math.abs(paddle.pos.z - ball.z) < (paddle.width / 2 + ball.r);

  let hitPaddle1 = () => {
    let ballEdge = ball.x - ball.r;
    let strikingSurface = paddle1.pos.x + (paddle1.depth / 2);
    let backSurface = paddle1.pos.x - (paddle1.depth / 2);

    if (ballEdge < strikingSurface && ballEdge > backSurface && isCollision(paddle1)) {
      velocity = Object.assign({}, velocity, {x: Math.abs(velocity.x)});
    }
  };

  let hitPaddle2 = () => {
    let ballEdge = ball.x + ball.r;
    let strikingSurface = paddle2.pos.x - (paddle2.depth / 2);
    let backSurface = paddle2.pos.x + (paddle2.depth / 2);

    if (ballEdge > strikingSurface && ballEdge < backSurface && isCollision(paddle2)) {
      velocity = Object.assign({}, velocity, {x: -1 * Math.abs(velocity.x)});
    }
  };
  hitPaddle1();
  hitPaddle2();

  // keyboard controls to move paddles
  const dPaddle = 10 * dt_seconds;
  if (keys[38] && paddle1.pos.z - paddle1.width/2 >= -arena.width/2) {
    state.paddle1.pos.z = paddle1.pos.z - dPaddle;
    state.paddle2.pos.z = paddle2.pos.z + dPaddle;
  }
  if (keys[40] && paddle1.pos.z + paddle1.width/2 <= arena.width/2) {
    state.paddle1.pos.z = paddle1.pos.z + dPaddle;
    state.paddle2.pos.z = paddle2.pos.z - dPaddle;
  }

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
    state.elevationVel += 0.07;
    state.ball = {x: 0, y, z, r, rotation};
  } else {
    let out_of_bounds = Math.abs(ball.x) > arena.width/2;
    if (out_of_bounds) {
      state.lightColor = "#f00";
    }
    state.ball.x += dt_seconds * velocity.x;
    state.ball.y += dt_seconds * velocity.y;
    state.ball.z += dt_seconds * velocity.z;
    state.ball.r = r;
    state.ball.rotation += 360 * dt_seconds;
    state.t += dt_seconds;
    state.velocity = velocity;
    state.elevationVel *= .95;
    state.elevation += elevationVel;
  }
}
