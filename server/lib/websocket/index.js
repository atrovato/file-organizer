class WebSocketManager {

  constructor(wss) {
    this.wss = wss;
  }

  send(key, message) {
    this.wss.send({ key, message });
  }

}

module.exports = WebSocketManager;
