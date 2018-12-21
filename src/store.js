import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// store is where shared information is kept. Events are handled by the event
// bus in main.js
const store = new Vuex.Store({
    state: {
        initialized: false,
        username: '',
        is_admin: false
    },
    mutations: {

        init (state) {

            // Prevent multiple initializations
            if (state.initialized) {
                return
            }
            state.initialized = true

            let username = localStorage.getItem('username')
            let is_admin = localStorage.getItem('is_admin')

            if (username) {
                state.username = username
            }
            if (is_admin && is_admin === 'true') {
                state.is_admin = true
            }
            
        },
        
        set_username (state, username) {
            state.username = username
        },

        set_admin (state, is_admin) {
            state.is_admin = is_admin
        },

        clear (state) {
            state.username = '',
            state.is_admin = false
        }

    },
    getters: {

        is_admin (state) {
            return state.is_admin
        }

    }
})

export default store