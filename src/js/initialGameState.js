

export default function buildInitialGameState() {
  let arenaSize = 15;
  return  {
    arena: {
      width: arenaSize,
      depth: arenaSize
    },
    paddle1: {
      pos: V3(-arenaSize/2, 0, 0),
      width: 1,
      height: 0.5,
      depth: 0.1
    },
    paddle2: {
      pos: V3(arenaSize/2, 0, 0),
      width: 1,
      height: 0.5,
      depth: 0.1
    },
    ball: {x: 0, y: 0, z: -5, r: 0.25, rotation: 0},
    velocity: {x: 3, y: 0, z: 3},
    lightColor: "#0f0",
    server: "c6102ead.ngrok.io"
  };
}
