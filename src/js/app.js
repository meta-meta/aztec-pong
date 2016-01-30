import 'aframe-core';
import 'babel-polyfill';
import {Animation, Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

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
              material={{color: '#fff'}}
              position={this.props.position}>
      </Entity>
    );
  }
}

class Pong extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
}


class BoilerplateScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ballPosition: {x: 0, y: 0, z: -5},
      velocity: {x: 1, y: 0, z: 0},
      t: 0
    }
  }

  componentDidMount() {
    window.setInterval(this.tick.bind(this), 17)
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
    return (
      <Scene>
        <Camera>{/*<Cursor/>*/}</Camera>

        <Sky/>

        <Light type="point" intensity="1" color="#0f0" position="-10 0 10"/>

        <Paddle position="-5 0 -5"/>
        <Paddle position="5 0 -5"/>
        <Ball position={`${x} ${y} ${z}`}/>
        <Ball position={`${x} ${y + 1} ${z}`}/>
        <Ball position={`${x * x} ${y + 1} ${z}`}/>
        <Ball position={`${x * x * x} ${y + 1} ${z}`}/>
      </Scene>
    );
  }
}

ReactDOM.render(<BoilerplateScene/>, document.querySelector('.scene-container'));
