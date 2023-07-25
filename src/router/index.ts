import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Branch from "@/views/Branch.vue";
import Folder from "@/views/Folder.vue";
import File from "@/views/File.vue";
import FileDetail from "@/views/FileDetail.vue";
import User from "@/views/User.vue";
import Login from "@/views/Login.vue";
import Shared from "@/views/Shared.vue";
import SharedFolder from "@/views/SharedFolder.vue";
import SharedFileDetail from "@/views/SharedFileDetail.vue";
import Companies from "@/views/Companies.vue";
import Company from "@/views/Company.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/shared/:id',
        name: 'SharedFolders',
        component: Shared,
    },
    {
        path: '/shared/:id/file',
        name: 'SharedFolderFiles',
        component: SharedFolder,
        props: (route) => ({
            shared_code: route.params.shared_code === undefined ? undefined : String(route.params.shared_code),
            folder: route.params.folder === undefined ? undefined : String(route.params.folder),
            branchId: route.params.branchId === undefined ? undefined : Number(route.params.branchId)
        })
    },
    {
        path: '/shared/:id/file/detail',
        name: 'SharedFile',
        component: SharedFileDetail,
        props: (route) => ({
            branch: route.params.branch === undefined ? undefined : JSON.parse(route.params.branch),
            code: route.params.code === undefined ? undefined : String(route.params.code),
            file_name: route.params.file_name === undefined ? undefined : String(route.params.file_name),
            shared_code: route.params.shared_code === undefined ? undefined : String(route.params.shared_code),
        })
    },
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
            dateInit: route.params.dateInit === undefined ? '' : String(route.params.dateInit),
            dateEnd: route.params.dateEnd === undefined ? '' : String(route.params.dateEnd)
        })
    },
    {
        path: '/folder',
        name: 'UserFolder',
        component: Folder,
        props: (route) => ({
            dateInit: route.params.dateInit === undefined ? '' : String(route.params.dateInit),
            dateEnd: route.params.dateEnd === undefined ? '' : String(route.params.dateEnd)
        })
    },
    {
        path: '/folder',
        name: 'Folder',
        component: Folder,
        props: (route) => ({
            dateInit: route.params.dateInit === undefined ? '' : String(route.params.dateInit),
            dateEnd: route.params.dateEnd === undefined ? '' : String(route.params.dateEnd)
        })

    },
    {
        path: '/folder/file',
        name: 'FolderFiles',
        component: File,
        props: (route) => ({
            branch: route.params.branch === undefined ? undefined : JSON.parse(route.params.branch),
            folder: route.params.folder === undefined ? undefined : String(route.params.folder),
            deleted: false,
            preRoute: route.params.preRoute === undefined ? undefined : String(route.params.preRoute),
            dateInit: route.params.dateInit === undefined ? '' : String(route.params.dateInit),
            dateEnd: route.params.dateEnd === undefined ? '' : String(route.params.dateEnd)
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
            preRoute: route.params.preRoute === undefined ? undefined : String(route.params.preRoute),
            dateInit: route.params.dateInit === undefined ? '' : String(route.params.dateInit),
            dateEnd: route.params.dateEnd === undefined ? '' : String(route.params.dateEnd)
        })
    },
    {
        path: '/companies',
        name: 'Companies',
        component: Companies,

    },
    {
        path: '/company',
        name: 'Company',
        component: Company,

    },
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
