// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css';

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

Vue.prototype.oepnID = "1";
let isFormData = (v) => {
  return Object.prototype.toString.call(v) === '[object FormData]';
}
Vue.use(Vant);
Vue.config.productionTip = false
axios.defaults.baseURL = process.env.API_ROOT;
axios.interceptors.request.use(
  config => {
    return config
  }, function (error) {
    console.log(error)
    return Promise.reject(error)
  }
)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
