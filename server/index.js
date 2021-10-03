const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require("http");

const { SOCKET_PORT, DOWNLOAD_DIR, MOVIE_DIR, SHOW_DIR } = require('./config');
const WebSocketManager = require('./lib/websocket');
const FileManager = require('./lib/files');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

const webSocketManager = new WebSocketManager(wss);
const fileManager = new FileManager(webSocketManager, DOWNLOAD_DIR, MOVIE_DIR, SHOW_DIR);

wss.on('connection', (ws) => {
  console.log('WSS connected!');
});

// enable cross origin requests
app.use(cors());

// JSON body
app.use(express.json())

app.get('/api/files', async (req, res) => {
  try {
    const files = await fileManager.list();
    res.json(files);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

app.post('/api/files/compute', (req, res) => {
  try {
    const result = fileManager.compute(req.body);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

app.post('/api/files', (req, res) => {
  try {
    const result = fileManager.move(req.body);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

app.listen(SOCKET_PORT, () => {
  console.log('Server is ready!');
});
