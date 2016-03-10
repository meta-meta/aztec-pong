import _ from 'lodash';


export default class InputController {
  constructor () {
    this.buffer = [];

    this.keyDownListeners = {
      32: () => this.buffer.push({type: 'reset'}),
      38: t => this.buffer.push({type: 'paddle-left-keydown', args: [t]}),
      40: t => this.buffer.push({type: 'paddle-right-keydown', args: [t]})
    };

    this.keyUpListeners = {
      38: t => this.buffer.push({type: 'paddle-left-keyup', args: [t]}),
      40: t => this.buffer.push({type: 'paddle-right-keyup', args: [t]})
    };

    this.handleKeyDown = e => {
      let key = e.keyCode;
      let t = Date.now();
      this.keyDownListeners[key] && this.keyDownListeners[key](t);
    };

    this.handleKeyUp = e => {
      let key = e.keyCode;
      let t = Date.now();
      this.keyUpListeners[key] && this.keyUpListeners[key](t);
    };

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }


  readEvents (inputState, camera) {
    // Poll the camera once per tick to get the lookat vector for this frame

    const position = camera.getWorldPosition().toArray();
    const direction = camera.getWorldDirection().toArray();
    this.buffer.push({type: 'camera-lookat', args: [position, direction]});

    return this.buffer.splice(0, this.buffer.length);
  }
}
