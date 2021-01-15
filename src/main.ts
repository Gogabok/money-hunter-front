import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueShepherd from 'vue-shepherd';

import './extenders';

Vue.config.productionTip = false;

Vue.use(VueShepherd);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
