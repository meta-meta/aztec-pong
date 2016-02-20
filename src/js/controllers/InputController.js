import _ from 'lodash';


export default class InputController {
  constructor (player) {
    this.player = player;
    this.buffer = [];

    this.keyDownListeners = {
      32: () => this.buffer.push({player: this.player, type: 'reset'})
    };

    this.keyUpListeners = {};

    // as well as a log of what keys were pressed and at what timestamp it was pressed and depressed.
    // For what portion of this tick was the key depressed? is the question we need to answer.
    this.depressedKeys = {};
    this.depressedKeyListeners = {
      38: dt => this.buffer.push({player: this.player, type: 'paddle-move-left', args: [dt]}),
      40: dt => this.buffer.push({player: this.player, type: 'paddle-move-right', args: [dt]})
    };

    // On keydown, set keystate with the timestamp of this ms.
    // On tick, for any currently pressed keys,
    //          set the timestamps to right now,
    //          return event "Key 38 was pressed for entire frame"

    // On keyup, for this key,
    //          remove the key from the map,
    //          buffer event "Key 38 was depressed for 8ms"

    // Key depressed can happen >=1 times per tick, and buffer multiple events, not debounced
    // Events as well, which are debounced

    this.handleKeyDown = e => {
      let key = e.keyCode();
      this.keyDownListeners[key]();
      this.depressedKeys[key] = Date.now();
    };

    this.handleKeyUp = e => {
      let key = e.keyCode();
      this.keyUpListeners[key]();
      let t0 = this.depressedKeys[key];
      let t1 = Date.now();
      let dt = t1 - t0;
      this.depressedKeyListeners[key](dt);
      delete this.depressedKeys[key];
    };

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }


  readEvents (inputState, camera) {
    // Poll the camera once per tick to get the lookat vector for this frame

    const position = camera.getWorldPosition();
    const direction = camera.getWorldDirection();
    this.buffer.push({player: this.player, type: 'camera-lookat', args: [position, direction]});

    return this.buffer.splice(0, this.buffer.length);
  }
}
