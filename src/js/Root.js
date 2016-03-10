import React from 'react';
import ReactDOM from 'react-dom';

import UI from './UI';
import AframeGame from './util/AframeGame';

import Scene from './Scene';


// The camera hack is why this component has to exist,
// and why the tick method has to be invoked from down here.

export default class Root extends React.Component {
  componentDidMount () {
    this.camera = ReactDOM.findDOMNode(this.refs.scene.refs.camera).components.camera.camera;
    this.tick = this.tick.bind(this);
  }

  render () {
    let {player, gameState} = this.props;

    /*refresh={this.forceUpdate.bind(this)}*/

    return <div>
      <AframeGame tick={this.tick.bind(this)} >
        <Scene ref="scene" state={gameState} player={player} cameraRef={this.cameraHack} />
      </AframeGame>
      <UI player={player} gameState={gameState} />
    </div>;
  }

  tick (dt_seconds) {
    this.props.tick(this.camera, dt_seconds);
    this.forceUpdate();
  }
}
