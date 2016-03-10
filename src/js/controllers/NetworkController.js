import _ from 'lodash';
import WebSocket from 'ws';


export default class NetworkController {
  constructor (server, player) {
    this.player = player;
    this.buffer = [];
    this.networkImpl = new BufferedWebsocket(this.buffer, server);
  }

  readEvents () {
    return this.buffer.splice(0, this.buffer.length);
  }

  writeEvents (inputEvents) {
    let inputEventsWithPlayer = _.map(inputEvents,
        event => _.extend(event, {player: this.player}));
    _.each(inputEventsWithPlayer, this.networkImpl.sendMessage.bind(this.networkImpl));
  }
}


class BufferedWebsocket {
  constructor(buffer, server) {
    this.buffer = buffer;
    this.ws = new WebSocket(`ws://${server}:80`);
    this.ws.onmessage = this.receiveMessage.bind(this);
  }

  receiveMessage(msg) {
    //console.log(msg.data, msg);
    const data = JSON.parse(msg.data);
    this.buffer.push(data);
  }

  sendMessage (msg) {
    this.ws.send(JSON.stringify(msg));
  }
}
