import React from 'react';

import UI from './js/UI';
import AframeGame from './js/util/AframeGame';

import App from './js/App';


// The camera hack is why this component has to exist,
// and why the tick method has to be invoked from down here.

export default class Root extends React.Component {
  componentDidMount () {
    this.camera = null; // can we get it here
    this.cameraHack = cmp => this.camera = ReactDOM.findDOMNode(cmp).components.camera.camera;
    this.tick = this.tick.bind(this);
  }

  render () {
    let {player, gameState} = this.props;

    return <div>
      <AframeGame tick={this.tick} refresh={this.forceUpdate}>
        <App state={gameState} player={player} cameraRef={this.cameraHack} />
      </AframeGame>
      <UI player={player} gameState={gameState} />
    </div>;
  }

  tick (dt_seconds) {
    this.props.tick(this.camera, dt_seconds);
  }
}
