import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Branch from "@/views/Branch.vue";
import Folder from "@/views/Folder.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/branch',
        name: 'Branch',
        component: Branch,
    },
    {
        path: '/branch/folder',
        name: 'BranchFolder',
        component: Folder,
        props: (route) => ({
            branch: route.params.branch === undefined ? undefined : JSON.parse(route.params.branch),
        })
    },
    {
        path: '/folder',
        name: 'Folder',
        component: Folder,

    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
