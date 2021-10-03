require('dotenv').config();

const config = {
  SOCKET_PORT: process.env.SOCKET_PORT || 9998,
  DOWNLOAD_DIR: process.env.DOWNLOAD_DIR || '/Downloads',
  MOVIE_DIR: process.env.MOVIE_DIR || '/Videos/Movies',
  SHOW_DIR: process.env.SHOW_DIR || '/Videos/Shows',
};

module.exports = config;
