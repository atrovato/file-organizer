class WebSocketManager {

  constructor(wss) {
    this.wss = wss;
  }

}

WebSocketManager.prototype.send = function (key, message) {
  this.wss.send({ key, message });
}

module.exports = WebSocketManager;
