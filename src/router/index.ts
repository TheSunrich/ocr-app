import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Branch from "@/views/Branch.vue";
import Folder from "@/views/Folder.vue";
import File from "@/views/File.vue";
import FileDetail from "@/views/FileDetail.vue";
import User from "@/views/User.vue";
import Login from "@/views/Login.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/branch',
        name: 'Branch',
        component: Branch,
    },
    {
        path: '/user',
        name: 'User',
        component: User,
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
        name: 'UserFolder',
        component: Folder,
    },
    {
        path: '/folder',
        name: 'Folder',
        component: Folder,

    },
    {
        path: '/folder/file',
        name: 'FolderFiles',
        component: File,
        props: (route) => ({
            branch: route.params.branch === undefined ? undefined : JSON.parse(route.params.branch),
            folder: route.params.folder === undefined ? undefined : String(route.params.folder),
            deleted: false,
            preRoute: route.params.preRoute === undefined ? undefined : String(route.params.preRoute)
        })
    },
    {
        path: '/file',
        name: 'File',
        component: FileDetail,
        props: (route) => ({
            branch: route.params.branch === undefined ? undefined : JSON.parse(route.params.branch),
            code: route.params.code === undefined ? undefined : String(route.params.code),
            file_name: route.params.file_name === undefined ? undefined : String(route.params.file_name),
            preRoute: route.params.preRoute === undefined ? undefined : String(route.params.preRoute)
        })
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
