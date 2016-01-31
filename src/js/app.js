import 'aframe-core';
import 'babel-polyfill';
import {Animation, Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import OSC from 'osc/dist/osc-browser';

import rgbToHex from './util/util.js';
import Camera from './components/Camera';
import Cursor from './components/Cursor';
import Light from './components/Light';
import Sky from './components/Sky';


class Temple extends React.Component {
  render() {
    return (

      <Entity loader={{src: 'url(models/model_scene-temple_03.dae)', format: 'collada'}}
              rotation={`0 180 0`}
              position={this.props.position}>
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
              position={this.props.position}>
      </Entity>
    );
  }
}

class Pedal extends React.Component {
  render() {
    return (
      <Entity rotation={`${-30 + 60 * this.props.depression} 0 0`} position={this.props.position}>
        <Entity geometry="primitive: box; width: 2; height: 0.5; depth: 3"
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
    this.state = {
      arena: {
        width: 10,
        depth: 10
      },
      paddle1: {
        x: -5,
        y: 0,
        z: 0,
        width: 1,
        height: 0.5,
        depth: 0.1
      },
      paddle2: {
        x: 5,
        y: 0,
        z: 0,
        width: 1,
        height: 0.5,
        depth: 0.1
      },
      ball: {x: 0, y: 0, z: -5, r: 0.25},
      velocity: {x: 2, y: 0, z: 0},
      t: 0,
      osc: {acc: {}},
      elevation: 0
    }
  }

  componentDidMount() {
    window.setInterval(this.tick.bind(this), 17);

    this.oscPort = new OSC.WebSocketPort({
      url: `ws://${window.location.hostname}:8081`
    });


    this.oscPort.on("message", (msg) => {
      let {osc, paddle1, paddle2} = this.state;

      if(msg.address == '/1/fader1') {
        osc.f1 = msg.args[0];
      }

      if(msg.address == '/1/fader4') {
        osc.f4 = msg.args[0];
      }

      if(msg.address == '/stepper') {
        osc.stairmaster = msg.args[0];
      }

      if(msg.address == '/accxyz') {
        osc.acc = {x: msg.args[0], y: msg.args[2], z: msg.args[1]};
      }

      paddle1.z = (osc.stairmaster - 0.5) * 10;
      paddle2.z = (1 - osc.stairmaster - 0.5) * 10;

      this.setState({osc, paddle1, paddle2});
    });

    this.oscPort.open();
  }

  tick() {
    let dt_seconds = .017;
    let {t, velocity, ball, paddle1, paddle2, elevation} = this.state;
    let {x, y, z, r} = ball;

    let isCollision = paddle => Math.abs(paddle.z - ball.z) < (paddle.width / 2 + ball.r);

    let hitPaddle1 = () => {
      let ballEdge = ball.x + ball.r;
      let strikingSurface = paddle1.x + (paddle1.depth / 2);
      let backSurface = paddle1.x - (paddle1.depth / 2);

      if (ballEdge < strikingSurface && ballEdge > backSurface && isCollision(paddle1)) {
        velocity = Object.assign({}, velocity, {x: Math.abs(velocity.x)});
      }
    };

    let hitPaddle2 = () => {
      let ballEdge = ball.x + ball.r;
      let strikingSurface = paddle2.x - (paddle2.depth / 2);
      let backSurface = paddle2.x + (paddle2.depth / 2);

      if (ballEdge > strikingSurface && ballEdge < backSurface && isCollision(paddle2)) {
        velocity = Object.assign({}, velocity, {x: -1 * Math.abs(velocity.x)});
      }
    };

    hitPaddle1();
    hitPaddle2();

    if(Math.abs(ball.x) > 7) {
      this.setState({
        elevation: elevation + 1,
        ball: {x: 0, y, z, r}
      });
    } else {
      this.setState({
        ball: {
          x: x + dt_seconds * velocity.x,
          y: y + dt_seconds * velocity.y,
          z: z + dt_seconds * velocity.z,
          r
        },
        t: t + dt_seconds,
        velocity
      });
    }


  }

  render() {
    let {x, y, z, r} = this.state.ball;

    let {acc} = this.state.osc;

    let {paddle1, paddle2} = this.state;

    return (
      <Scene>
        <Camera y={this.state.elevation}>{/*<Cursor/>*/}</Camera>

        <Sky/>

        <Light type="ambient" color="#666"/>
        <Light type="point" intensity="1" color="#766" position="-5 0 10"/>

        <Light type="point" intensity="2" distance="20" color="#0f0" position="100 -40 260"/>

        <Temple position={`0 -50 55`}/>

        <Arena position={`0 -1 -7`} width={this.state.width} height={0.1} depth={this.state.depth} />

        <Paddle position={`${paddle1.x} ${paddle1.y} ${paddle1.z}`}
                width={paddle1.width}
                height={paddle1.height}
                depth={paddle1.depth}
                color="#faa"/>
        <Paddle position={`${paddle2.x} ${paddle2.y} ${paddle2.z}`}
                width={paddle2.width}
                height={paddle2.height}
                depth={paddle2.depth}
                color="#aaf"/>

        <Ball position={`${x} ${y} ${z}`} radius={r} color={rgbToHex(128 + acc.x * 12.8, 128 + acc.y * 12.8, 128 + acc.z * 12.8)}/>

        <Pedal position="-2 -3 0" depression={this.state.osc.stairmaster || 0}/>
        <Pedal position="2 -3 0" depression={1 - this.state.osc.stairmaster || 0}/>
      </Scene>
    );
  }
}
