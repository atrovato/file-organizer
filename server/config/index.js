require('dotenv').config();

const config = {
  SOCKET_PORT: process.env.SOCKET_PORT || 9998,
  WEBSOCKET_PORT: process.env.WEBSOCKET_PORT || 9997,
  DOWNLOAD_DIR: process.env.DOWNLOAD_DIR || '/',
};

module.exports = config;
