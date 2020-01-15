import Vue from 'vue'
import App from './App.vue'
import store from './vuex/index'
import router from "./router/index"
import './theme/index.css'
import '../icon/iconfont.css'
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
const  codec  = require("irisnet-crypto/util/codec.js") ;
const  crypto = require("irisnet-crypto");
Vue.prototype.$Codec = codec;
Vue.prototype.$Crypto = crypto;
locale.use(lang);
Vue.use(ElementUI)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
