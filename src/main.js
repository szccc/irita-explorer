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
import VueI18n from 'vue-i18n'
Vue.prototype.$Codec = codec;
Vue.prototype.$Crypto = crypto;

console.log('=============:',process.env);

locale.use(lang);
Vue.use(ElementUI)
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale:'zh-CN',
  messages: {
    "zh-CN" : require('../lang/CN-Cindy')
  }
})
Vue.config.productionTip = false;
new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
