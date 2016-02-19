import _ from 'lodash';


export default function gameTick (state, camera, networkController, player, dt_seconds) {


  const p = camera.getWorldPosition();
  const d = camera.getWorldDirection();
  const ray = new THREE.Ray(p, d);
  const plane = new THREE.Plane(
      new THREE.Vector3(player === '1' ? 1 : -1, 0, 0),
      state.arena.width / 2);
  const paddleZ = ray.intersectPlane(plane).z;


  let {velocity, ball, paddle1, paddle2, arena, keys} = state;
  let {y, z, r, rotation} = ball;

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


  const mypaddle = player === '1' ? paddle1 : paddle2;


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
  if (keys[32]) {
    networkController.sendGameStart();
  }

  const w = state.arena.width / 2;
  mypaddle.pos.z = THREE.Math.clamp(paddleZ, -w, w);

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
    state.ball.x += dt_seconds * velocity.x;
    state.ball.y += dt_seconds * velocity.y;
    state.ball.z += dt_seconds * velocity.z;
    state.ball.r = r;
    state.ball.rotation += 360 * dt_seconds;
    state.t += dt_seconds;
    state.velocity = velocity;
  }

  networkController.onSendMyPaddlePosition(mypaddle.pos.z);
}
