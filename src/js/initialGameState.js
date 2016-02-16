

export default function buildInitialGameState() {
  let arenaSize = 15;
  return  {
    arena: {
      width: arenaSize,
      depth: arenaSize
    },
    paddle1: {
      pos: new THREE.Vector3(-arenaSize/2, 0, 0),
      width: 1,
      height: 0.5,
      depth: 0.1
    },
    paddle2: {
      pos: new THREE.Vector3(arenaSize/2, 0, 0),
      width: 1,
      height: 0.5,
      depth: 0.1
    },
    ball: {x: 0, y: 0, z: -5, r: 0.25, rotation: 0},
    velocity: {x: 3, y: 0, z: 3},
    t: 0,
    osc: {acc: {}},
    keys: { 38: false, 40: false },
    elevation: 3,
    elevationVel: 0,
    lightColor: "#0f0"
  };
}
