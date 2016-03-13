

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
    ball: {
      position: V3(0, 0, -5),
      velocity: V3(3, 0, 3),
      r: 0.25,
      rotation: 0
    },
    lightColor: "#0f0",
    server: "c6102ead.ngrok.io"
  };
}
