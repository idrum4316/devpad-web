import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'

// Vue configuration
Vue.config.productionTip = false

// Axios.js
import axios from 'axios'
Object.defineProperty(Vue.prototype, '$axios', { value: axios })

// Moment.js
import moment from 'moment'
Object.defineProperty(Vue.prototype, '$moment', { value: moment })

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFile, faTag, faSearch, faHome, faFileAlt, faTags, faPlus, faFilter, faEdit, faEye, faSave, faBan, faTrash, faAngleDown, faCalendar, faExclamationTriangle, faUser, faKey, faSignOutAlt, faCogs, faCheck, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faFile, faTag, faSearch, faHome, faFileAlt, faTags, faPlus, faFilter, faEdit, faEye, faSave, faBan, faTrash, faAngleDown, faCalendar, faExclamationTriangle, faUser, faKey, faSignOutAlt, faCogs, faCheck, faUsers)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Global event bus
Vue.prototype.$bus = new Vue();

import store from './store'

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
