import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css';
Vue.config.productionTip = false


import { debounceDirective } from './directive/debounce'
Vue.directive('debounce', debounceDirective)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')