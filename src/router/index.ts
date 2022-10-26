import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Branch from "@/views/Branch.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Branch',
    component: Branch
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
