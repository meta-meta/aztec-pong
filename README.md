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