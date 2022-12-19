import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from "vuex-persist";
import Folder from "@/models/folder";

const vuexPers = new VuexPersistence({
    storage: window.localStorage,
})

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        collapsed: false,
        isShareActive: false,
        shareList: [] as Folder[]
    },
    mutations: {
        toggleSidebar(state) {
            state.collapsed = !state.collapsed;
        },
        toggleShareActive(state){
            state.isShareActive = !state.isShareActive;
        },
        setShareActive(state, isShare: boolean){
            state.isShareActive = isShare;
        },
        addToShareList(state, folder: Folder) {
            state.shareList.push(folder);
        },
        deleteFolderInShareList(state, index: number) {
            if(index > -1){
                state.shareList.splice(index, 1);
            }
        },
        emptyShareList(state) {
            state.shareList = [] as Folder[];
        }
    },
    getters: {},
    actions: {},
    modules: {},
    plugins: [vuexPers.plugin]
})
