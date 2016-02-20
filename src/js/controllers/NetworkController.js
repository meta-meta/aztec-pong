import _ from 'lodash';
import WebSocket from 'ws';


export default class NetworkController {
  constructor () {
    this.buffer = [];
    this.networkImpl = new BufferedWebsocket(this.buffer);
  }sj

  readEvents () {
    return this.buffer.splice(0, this.buffer.length);
  }

  writeEvents (gameEvents) {
    _.each(gameEvents, this.networkImpl.sendMessage);
  }
}


class BufferedWebsocket {
  constructor(buffer) {
    this.buffer = buffer;
    this.ws = new WebSocket(`ws://${window.location.hostname}:8081`);
    this.ws.onmessage = this.receiveMessage.bind(this);
  }

  receiveMessage(msg) {
    console.log(msg.data, msg);
    const data = JSON.parse(msg.data);
    this.buffer.push(data);
  }

  sendMessage (msg) {
    this.ws.send(JSON.stringify(msg));
  }
}
