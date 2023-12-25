import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import locale from 'element-ui/lib/locale/lang/vi'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

/* add icons to the library */
library.add(fas,fab,far)

/* add font awesome icon component */
Vue.component("fa", FontAwesomeIcon)

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false
Vue.directive('debounce', {
  inserted: function (el, binding) {
    let timeout = null;
    el.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        el.dispatchEvent(new Event('change'));
      }, binding.value || 500);
    });
  }
});
Vue.use(ElementUI, { locale });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')