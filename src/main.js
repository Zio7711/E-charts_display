import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "./assets/font/iconfont.css";
import "./assets/css/global.less";
// import SocketService from "./utils/socket_service";

// SocketService.Instance.connect();

// axios.defaults.baseURL = "http://192.168.201.38:9997/api/";
// axios.defaults.baseURL = "http://localhost:8080/";
axios.defaults.baseURL =
  "https://e-charts-display-b9knskbjr-zio7711.vercel.app/";

Vue.prototype.$http = axios;
// Vue.prototype.$socket = SocketService.Instance;
Vue.prototype.$echarts = window.echarts;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
