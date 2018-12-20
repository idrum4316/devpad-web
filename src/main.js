import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import axios from 'axios'
Object.defineProperty(Vue.prototype, '$axios', { value: axios })

import moment from 'moment'
Object.defineProperty(Vue.prototype, '$moment', { value: moment })

import { library } from '@fortawesome/fontawesome-svg-core'
import { faFile, faTag, faSearch, faHome, faFileAlt, faTags, faPlus, faFilter, faEdit, faEye, faSave, faBan, faTrash, faAngleDown, faCalendar, faExclamationTriangle, faUser, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faFile, faTag, faSearch, faHome, faFileAlt, faTags, faPlus, faFilter, faEdit, faEye, faSave, faBan, faTrash, faAngleDown, faCalendar, faExclamationTriangle, faUser, faKey, faSignOutAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
