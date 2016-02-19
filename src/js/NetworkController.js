

export default class NetworkController {
  constructor(player, state) {
    this.player = player;
    this.state = state;

    this.ws = new WebSocket(`ws://${window.location.hostname}:8081`);
    this.ws.onmessage = (this.receiveMessage.bind(this));
  }

  receiveMessage(msg) {
    console.log(msg.data, msg);
    this.receivePaddlePosition(JSON.parse(msg.data));
  }

  receivePaddlePosition(msg) {
    const {newPos} = msg;
    this.state[`paddle${msg.uuid}`].pos.z = newPos;
  }

  onSendMyPaddlePosition(newPos) {
    let msg = {uuid: this.player, newPos};
    this.ws.send(JSON.stringify(msg));
  }
}
