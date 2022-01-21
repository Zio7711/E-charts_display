export default class SocketService {
  static instance = null;
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }

  ws = null;
  connect() {
    if (!window.WebSocket) return console.log("您的浏览器不支持 WebSocket");

    this.ws = new WebSocket("ws://192.168.201.38:9998");

    this.ws.onopen = () => {
      console.log("ws connected successful");
    };

    this.ws.onclose = () => {
      console.log("ws connected failed");
    };

    this.ws.onmessage = (msg) => {
      console.log("got data from server", msg.data);
    };
  }
}
