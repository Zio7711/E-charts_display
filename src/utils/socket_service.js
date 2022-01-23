export default class SocketService {
  static instance = null;
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }

  ws = null;
  connected = false;
  connect() {
    if (!window.WebSocket) return console.log("您的浏览器不支持 WebSocket");

    this.ws = new WebSocket("ws://192.168.201.38:9998");

    this.ws.onopen = () => {
      console.log("ws connected successful");
      this.connected = true;
    };

    this.ws.onclose = () => {
      this.connectRetryCount++;
      this.connected = false;
      setTimeout(() => {
        this.connect();
      }, this.connectRetryCount * 500);
      console.log("ws connected closed");
    };

    this.ws.onerror = () => {
      this.connected = false;
      console.log("error on connecting ws");
    };

    this.ws.onmessage = (msg) => {
      const recvData = JSON.parse(msg.data);
      const socketType = recvData.socketType;

      if (this.callBackMapping[socketType]) {
        const action = recvData.action;
        if (action === "getData") {
          const realData = JSON.parse(recvData.data);
          this.callBackMapping[socketType](realData);
        } else if (action === "fullScreen") {
          this.callBackMapping[socketType].call(this, recvData);
        } else if (action === "themeChange") {
          this.callBackMapping[socketType].call(this, recvData);
        }
      }
    };
  }

  callBackMapping = {};

  registerCallBack(socketType, callback) {
    this.callBackMapping[socketType] = callback;
  }

  unRegisterCallBack(socketType) {
    this.callBackMapping[socketType] = null;
  }

  send(data) {
    if (this.connected) {
      this.sendRetryCount = 0;

      this.ws.send(JSON.stringify(data));
    } else {
      this.sendRetryCount++;

      setTimeout(() => {
        this.send(data);
      }, this.sendRetryCount * 500);
    }
  }
}
