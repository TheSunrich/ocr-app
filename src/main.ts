import "vue-toastification/dist/index.css";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Toast from "vue-toastification";
import mitt from 'mitt'
import BootstrapVue from 'bootstrap-vue'
import axios from "axios";
import VueAxios from "vue-axios";
import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'


import {
    faBars, faPencil, faBorderAll, faListCheck,
    faList, faSection, faPlus, faFileLines,
    faPaperPlane, faTrash, faSearch, faLock,
    faLockOpen, faCalendarXmark, faCircleCheck, faClose,
    faArrowRightToBracket, faArrowRightFromBracket, faFileCircleCheck, faFileCircleExclamation,
    faPlay, faChartColumn, faComputer, faPeopleLine,
    faCodeBranch, faFolder, faFolderTree, faFolderOpen, faUsers, faShareAlt, faUser,
    faShare, faShareNodes, faLink, faMagnifyingGlassMinus, faMagnifyingGlassPlus,
    faArrowRotateLeft, faEye, faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'
import {faBuilding, faFilePdf} from '@fortawesome/free-regular-svg-icons'

export const emitter = mitt()

library.add(
    faEye,
    faEyeSlash,
    faBars,
    faBorderAll,
    faBuilding,
    faListCheck,
    faSection,
    faFileLines,
    faPlus,
    faList,
    faPencil,
    faPaperPlane,
    faTrash,
    faSearch,
    faLock,
    faLockOpen,
    faCalendarXmark,
    faCircleCheck,
    faClose,
    faArrowRightToBracket,
    faArrowRightFromBracket,
    faFileCircleCheck,
    faFileCircleExclamation,
    faPlay,
    faChartColumn,
    faComputer,
    faPeopleLine,
    faCodeBranch,
    faFolder,
    faFolderTree,
    faFolderOpen,
    faUsers,
    faShareAlt,
    faShare,
    faShareNodes,
    faLink,
    faMagnifyingGlassMinus,
    faMagnifyingGlassPlus,
    faFilePdf,
    faArrowRotateLeft,
    faUser
)

axios.defaults.baseURL = "http://192.168.100.60:8000/"

Vue.use(VueAxios, axios)

Vue.use(BootstrapVue)

Vue.component('font-awesome-icon', FontAwesomeIcon)

const options = {
    transition: "Vue-Toastification__fade",
    maxToasts: 10,
    newestOnTop: true
};

Vue.use(Toast, options);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
