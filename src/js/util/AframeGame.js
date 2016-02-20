import React from 'react';
import {Scene} from 'aframe-react';



export default class AframeGame extends React.Component {
  render () {
    return <Scene onTick={this.sceneTick.bind(this)}>
      {this.props.children}
    </Scene>;
  }

  sceneTick () {
    const prev_t_ms = this.t_ms || Date.now();
    this.t_ms = Date.now();
    let dt_seconds = (this.t_ms - prev_t_ms) / 1000;

    this.props.tick(dt_seconds);
    this.props.refresh();
  }
}
