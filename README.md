## Aztec Pong

Use the up and down arrows to move the paddles
mouse look


### Getting Started

Serve the webapp:
```bash
npm install
npm start
```

Start the Web Socket server in another terminal:
```bash
cd SerialAndOscWebSocketsServer
npm install
node .
```


Then head over to localhost:8080


Send OSC messages over port `57121`


Run the ws relay and share it over networked
 * https://ngrok.com/
 * ./ngrok http 8080 - app (npm start)
 * ./ngrok http 8081 - relay (wsrelay)
 * hardcode the gamestate.server to the ws url (without http://)


### gh-pages

change to your repo in package.json:
```json
"repository": {
    "type": "git",
    "url": "https://github.com/meta-meta/aframe-react-boilerplate.git"
  },
```
```bash
npm run ghpages
```