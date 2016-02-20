import 'babel-polyfill';
import {registerComponent, components} from 'aframe-core';
import NoClickLookControls from 'aframe-no-click-look-controls';
registerComponent('no-click-look-controls', NoClickLookControls.component);

THREE.Vector3.prototype.toAframeString = function() {return `${this.x} ${this.y} ${this.z}`};
window.V3 = (x, y, z) => new THREE.Vector3(x, y, z);
window.V3toStr = (x, y, z) => V3(x, y, z).toAframeString();
