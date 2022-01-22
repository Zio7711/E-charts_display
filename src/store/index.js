import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    theme: "purple-passion",
  },
  mutations: {
    CHANGETHEME(state) {
      if (state.theme === "purple-passion") {
        state.theme = "vintage";
      } else {
        state.theme = "purple-passion";
      }
    },
  },

  modules: {},
});
