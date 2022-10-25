import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from "vuex-persist";

const vuexPers = new VuexPersistence({
    storage: window.localStorage,
})

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        collapsed: false,
    },
    mutations: {
        toggleSidebar(state) {
            state.collapsed = !state.collapsed;
        },
    },
    getters: {},
    actions: {},
    modules: {},
    plugins: [vuexPers.plugin]
})
