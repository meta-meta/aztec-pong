import 'aframe-core';
import 'babel-polyfill';
import {Animation, Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import OSC from 'osc/dist/osc-browser';

import Camera from './components/Camera';
import Cursor from './components/Cursor';
import Light from './components/Light';
import Sky from './components/Sky';

class Paddle extends React.Component {
  render() {
    return (

      <Entity geometry="primitive: box; width: 3; height: 1; depth: 0.1"
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

      <Entity geometry="primitive: sphere; radius: 0.25"
              material={{color: this.props.color}}
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
                material={{color: '#555'}}
                position="0 0 3"
        />
      </Entity>
    );
  }
}

function rgbToHex(r, g, b) {
  function constrain(x) {
    return Math.min(255, Math.max(0, Math.round(x)));
  }
  return "#" + ((1 << 24) + (constrain(r) << 16) + (constrain(g) << 8) + constrain(b)).toString(16).slice(1);
}

class BoilerplateScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ballPosition: {x: 0, y: 0, z: -5},
      velocity: {x: 1, y: 0, z: 0},
      t: 0,
      osc: {acc: {}}
    }
  }

  componentDidMount() {
    window.setInterval(this.tick.bind(this), 17);

    this.oscPort = new OSC.WebSocketPort({
      url: "ws://localhost:8081"
    });


    this.listen = () => {
      this.oscPort.on("message", (msg) => {
        let osc = this.state.osc;

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

        this.setState({osc});
      });
    };

    this.listen();
    this.oscPort.open();
  }

  tick() {
    let dt_seconds = .017;
    let {t, velocity, ballPosition} = this.state;
    let {x,y,z} = ballPosition;

    if(x > 5) velocity = Object.assign({}, velocity, {x: -1});
    if(x < -5) velocity = Object.assign({}, velocity, {x: 1});;

    this.setState({
      ballPosition: {
        x: x + dt_seconds * velocity.x,
        y: y + dt_seconds * velocity.y,
        z: z + dt_seconds * velocity.z
      },
      t: t + dt_seconds,
      velocity
    })
  }

  render() {
    let {x, y, z} = this.state.ballPosition;

    let {acc} = this.state.osc;

    return (
      <Scene>
        <Camera>{/*<Cursor/>*/}</Camera>

        <Sky/>

        <Light type="point" intensity="1" color="#ddd" position="-10 0 10"/>

        <Paddle position={`-5 0 ${-5 + this.state.osc.f1 * -5}`} />
        <Paddle position={`5 0 ${-5 + this.state.osc.f4 * -5}`} />

        <Ball position={`${x} ${y} ${z}`} color={rgbToHex(128 + acc.x * 12.8, 128 + acc.y * 12.8, 128 + acc.z * 12.8)}/>

        <Pedal position="-2 -3 -10" depression={this.state.osc.stairmaster || 0}/>
        <Pedal position="2 -3 -10" depression={1 - this.state.osc.stairmaster || 0}/>
      </Scene>
    );
  }
}

ReactDOM.render(<BoilerplateScene/>, document.querySelector('.scene-container'));
