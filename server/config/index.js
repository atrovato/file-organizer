require('dotenv').config();

const config = {
  SOCKET_PORT: process.env.SOCKET_PORT || 9998,
  WEBSOCKET_PORT: process.env.WEBSOCKET_PORT || 9997,
  DOWNLOAD_DIR: process.env.DOWNLOAD_DIR || '/Downloads',
  MOVIE_DIR: process.env.MOVIE_DIR || '/Videos/Movies',
  SHOW_DIR: process.env.SHOW_DIR || '/Videos/Shows',
};

module.exports = config;
