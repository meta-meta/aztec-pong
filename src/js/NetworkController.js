import initialGameState from './initialGameState';
import _ from 'lodash';

export default class NetworkController {
  constructor(player, state) {
    this.player = player;
    this.state = state;

    this.ws = new WebSocket(`ws://${window.location.hostname}:8081`);
    this.ws.onmessage = (this.receiveMessage.bind(this));


    this.sendGameStart = _.debounce(() => {
      let msg = {player: this.player, type: 'reset'};
      this.ws.send(JSON.stringify(msg));
      this.resetState()
    }, 1000, {leading: true});

    this.resetState = () => {
      Object.assign(this.state, initialGameState());
      console.log('reset game');
    };
  }

  receiveMessage(msg) {
    console.log(msg.data, msg);
    const data = JSON.parse(msg.data);
    const dispatch = {
      paddle: this.receivePaddlePosition,
      reset: this.receiveGameStart
    };

    dispatch[data.type].apply(this, [data.player].concat(data.args))
  }

  receiveGameStart(player) {
    this.resetState()
  }

  receivePaddlePosition(player, newPos) {
    this.state[`paddle${player}`].pos.z = newPos;
  }

  onSendMyPaddlePosition(newPos) {
    let msg = {player: this.player, type:'paddle', args: [newPos]};
    this.ws.send(JSON.stringify(msg));
  }
}
