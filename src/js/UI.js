import React from 'react';


export default class UI extends React.Component {
  render () {
    return <pre style={{position: 'absolute', zIndex: 1, pointerEvents: 'none'}}>
      {JSON.stringify(this.props.gameState, null, 2)}
    </pre>;
  }
}
