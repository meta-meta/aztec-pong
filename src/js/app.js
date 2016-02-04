import 'aframe-core';
import 'babel-polyfill';
import {Animation, Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
//import OSC from 'osc/dist/osc-browser';

import rgbToHex from './util/util.js';
import Camera from './components/Camera';
import Cursor from './components/Cursor';
import Light from './components/Light';
import Sky from './components/Sky';

class Temple extends React.Component {
  render() {
    return (

      <Entity loader={{src: 'url(models/model_scene-temple_04.dae)', format: 'collada'}}
              rotation={`0 180 0`}
              position={this.props.position}>
      </Entity>
    );
  }
}

class Cloud extends React.Component {
  render() {
    const {scale} = this.props;
    return (
      <Entity loader={{src: 'url(models/model_cloud_01.dae)', format: 'collada'}}
              material={{color: '#fff', transparent: true, opacity: 0.2}}
              rotation={`0 180 0`}
              scale={`${scale} ${scale} ${scale}`}
              position={this.props.position}
      >
      </Entity>
    );
  }
}

class Paddle extends React.Component {
  render() {
    const {width, height, depth, color} = this.props;
    return (
      <Entity geometry={{primitive: 'box', width, height, depth}}
              material={{color}}
              position={this.props.position}
              rotation="0 90 0">
      </Entity>
    );
  }
}

class Arena extends React.Component {
  render() {
    const {width, height, depth} = this.props;
    return (
      <Entity geometry={{primitive: 'box', width, height, depth}}
            material={{color: '#fff'}}
            position={this.props.position}
            rotation="0 90 0">
      </Entity>
    );
  }
}

class Ball extends React.Component {
  render() {
    return (
      <Entity geometry={{primitive: 'sphere', radius: this.props.radius}}
              material={{color: this.props.color, src: 'url(images/hazard.png)'}}
              position={this.props.position}
              rotation={this.props.rotation}>
      </Entity>
    );
  }
}

class Pedal extends React.Component {
  render() {
    return (
      <Entity rotation={`${-30 + 60 * this.props.depression} 0 0`} position={this.props.position}>
        <Entity geometry="primitive: box; width: 1.5; height: 0.5; depth: 2.5"
                material={{color: '#555', metalness: 1}}
                position="0 0 3"
        />
      </Entity>
    );
  }
}

export class App extends React.Component {
  constructor(props) {
    super(props);
    let arenaSize = 15;

    this.state = {
      arena: {
        width: arenaSize,
        depth: arenaSize
      },
      paddle1: {
        pos: new THREE.Vector3(-arenaSize/2, 0, 0),
        width: 1,
        height: 0.5,
        depth: 0.1
      },
      paddle2: {
        pos: new THREE.Vector3(arenaSize/2, 0, 0),
        width: 1,
        height: 0.5,
        depth: 0.1
      },
      ball: {x: 0, y: 0, z: -5, r: 0.25, rotation: 0},
      velocity: {x: 3, y: 0, z: 3},
      t: 0,
      osc: {acc: {}},
      keys: { 38: false, 40: false },
      elevation: 3,
      elevationVel: 0,
      lightColor: "#0f0"
    }
  }

  componentDidMount() {
    window.setInterval(this.tick.bind(this), 17);

    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));

    this.oscPort = new OSC.WebSocketPort({
      url: `ws://${window.location.hostname}:8081`
    });

    this.oscPort.on("message", (msg) => {
      let {osc, paddle1, paddle2} = this.state;

      if (msg.address == '/1/fader1') {
        osc.f1 = msg.args[0];
      }

      if (msg.address == '/1/fader4') {
        osc.f4 = msg.args[0];
      }

      if (msg.address == '/stepper') {
        osc.stairmaster = msg.args[0];
      }

      if (msg.address == '/accxyz') {
        osc.acc = {x: msg.args[0], y: msg.args[2], z: msg.args[1]};
      }

      paddle1.pos.z = (osc.stairmaster - 0.5) * this.state.arena.width;
      paddle2.pos.z = (1 - osc.stairmaster - 0.5) * this.state.arena.width;

      this.setState({osc, paddle1, paddle2});
    });

    this.oscPort.open();
  }

  handleKeyDown(e) {
    this.setState({keys: Object.assign({}, this.state.keys, {[e.keyCode]: true})});
  }

  handleKeyUp(e) {
    this.setState({keys: Object.assign({}, this.state.keys, {[e.keyCode]: false})});
  }

  tick() {
    let dt_seconds = .017;
    let {t, velocity, ball, paddle1, paddle2, arena, elevation, elevationVel, keys} = this.state;
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
      this.state.paddle1.pos.z = paddle1.pos.z - dPaddle;
      this.state.paddle2.pos.z = paddle2.pos.z + dPaddle;
    }
    if (keys[40] && paddle1.pos.z + paddle1.width/2 <= arena.width/2) {
      this.state.paddle1.pos.z = paddle1.pos.z + dPaddle;
      this.state.paddle2.pos.z = paddle2.pos.z - dPaddle;
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
      this.setState({
        lightColor: "#0f0",
        elevationVel: elevationVel + 0.07,
        ball: {x: 0, y, z, r, rotation}
      });
    } else {
      let out_of_bounds = Math.abs(ball.x) > arena.width/2;
      if (out_of_bounds) {
        this.setState({ lightColor: "#f00" });
      }
      this.setState({
        ball: {
          x: x + dt_seconds * velocity.x,
          y: y + dt_seconds * velocity.y,
          z: z + dt_seconds * velocity.z,
          r,
          rotation: rotation + 360 * dt_seconds
        },
        t: t + dt_seconds,
        velocity,
        elevationVel: elevationVel * 0.95,
        elevation: elevation + elevationVel
      });
    }

    this.forceUpdate();
  }

  render() {
    let {x, y, z, r, rotation} = this.state.ball;
    let {acc, stairmaster} = this.state.osc;
    let {paddle1, paddle2, elevation} = this.state;

    return (
      <Scene>
        <Entity position={`0 ${elevation + 8} 10`}>
          <Camera>{/*<Cursor/>*/}</Camera>

          { !stairmaster ?
            <Entity position={`0 -10 -1`}>
              <Pedal position="-1 0 0" depression={this.state.osc.stairmaster}/>
              <Pedal position="1 0 0" depression={1 - this.state.osc.stairmaster}/>
            </Entity> : null
          }
        </Entity>

        <Sky/>

        {/*Light doesn't know what to do with the position component for some reason*/}
        <Light type="ambient" color="#666"/>
        <Light type="point" intensity="1" color="#766"/>
        <Light type="point" intensity="2" distance="20" color={this.state.lightColor}/>

        <Temple position={`0 -40 56`}/>

        <Cloud position={`4 80 3`} scale={2} />
        <Cloud position={`-5 20 -2`} scale={0.5} />
        <Cloud position={`7 30 -5`} scale={0.5} />
        <Cloud position={`7 50 -5`} scale={0.5} />

        <Arena position={`0 -0.4 0`} width={this.state.arena.width} height={0.1} depth={this.state.arena.depth} />

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

        <Ball position={`${x} ${y} ${z}`} rotation={`0 ${rotation} 0`} radius={r}
              color={rgbToHex(128 + acc.x * 12.8, 128 + acc.y * 12.8, 128 + acc.z * 12.8)}/>
      </Scene>
    );
  }
}
