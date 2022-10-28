<template>
  <div id="app">
    <Sidebar/>
    <div class="app_container" :style="{marginLeft: getSidebarWidth}">
      <Navbar/>
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import Navbar from "@/components/Navbar/Navbar.vue";
import Toast from "@/components/Toast/Toast.vue";
import {emitter} from "@/main";
import Vue, {defineComponent} from "vue";

const SIDEBAR_WIDTH = 220;
const SIDEBAR_WIDTH_COLLAPSED = 70;

export default defineComponent({
  components: {Navbar, Sidebar},
  mounted() {
    emitter.on('show-toast', (args: any) => {
      this.$toast({
        component: Toast,
        props: {
          title: args.title,
          description: args.description
        }
      }, {
        type: args.type,
        icon: args.icon,
        timeout: 3000,
        toastClassName: "custom-toast",
      });
    });
  },
  computed: {
    isCollapsed(): boolean {
      return this.$store.state.collapsed;
    },
    getSidebarWidth(): string {
      if (this.$route.path.substring(this.$route.path.length - 6) === '/login') {
        return '0';
      }
      return `${this.isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH}px`;
    },
  },
  methods: {}
})
</script>

<style lang="scss">
@import './assets/scss/toast';

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

html {
  overflow-y: auto !important;
}

body {
  background-color: #eef5ee !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

a {
  color: #2c3e50;
  text-decoration: none;
}

a:hover {
  color: #2c3e50;
  text-decoration: none;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.app_container {
  transition: 0.5s ease-in-out;
}
</style>
