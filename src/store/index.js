import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import home from './modules/home'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    modules: {
        auth,
        home,
    },
    plugins: [createPersistedState({paths: ['auth']})]
})

export default store