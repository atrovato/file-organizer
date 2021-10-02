const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const { SOCKET_PORT, WEBSOCKET_PORT, DOWNLOAD_DIR } = require('./config');
const WebSocketManager = require('./lib/websocket');
const FileManager = require('./lib/files');

const app = express();
const wss = new WebSocketServer({ port: WEBSOCKET_PORT });
const fileManager = new FileManager(DOWNLOAD_DIR);
const webSocketManager = new WebSocketManager(wss, fileManager);

// enable cross origin requests
app.use(cors());

app.get('/api/files', async (req, res) => {
  try {
    const files = await fileManager.list();
    res.json(files);
  } catch (e) {
    res.status(404).json(e);
  }
});

app.listen(SOCKET_PORT, () => {
  console.log('Server is ready!');
});
