<template>
  <div id="app">
    <Sidebar v-if="($route.name !== 'SharedFolders' && $route.name !== 'SharedFolderFiles' && $route.name !== 'SharedFile' && $store.state.user !== false) || ($route.path.substring($route.path.length - 6) !== '/login' && $store.state.user.role === 1)" />
    <div class="app_container" :style="{marginLeft: getSidebarWidth, marginRight: getShareWidth}">
      <Navbar v-if="$route.path.substring($route.path.length - 6) !== '/login' && $store.state.user" />
      <transition name="fade" mode="out-in">
        <router-view :key="$route.name" />
      </transition>
    </div>
    <SharePanel />
  </div>
</template>

<script lang="ts">
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import Navbar from "@/components/Navbar/Navbar.vue";
import SharePanel from "@/components/Share/SharePanel.vue";
import Toast from "@/components/Toast/Toast.vue";
import {emitter} from "@/main";
import Vue, {defineComponent} from "vue";

const SIDEBAR_WIDTH = 200;
const SIDEBAR_WIDTH_COLLAPSED = 70;
const SHARE_WIDTH = 275;
const SHARE_WIDTH_COLLAPSED = 0;

export default defineComponent({
  components: {Navbar, Sidebar, SharePanel},
  created() {
    this.correctRouting()
  },
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
    emitter.on('check-routes', () => this.correctRouting());
  },
  computed: {
    isCollapsed(): boolean {
      return this.$store.state.collapsed;
    },
    isShareCollapsed(): boolean {
      return !this.$store.state.isShareActive;
    },
    getSidebarWidth(): string {
      if (((this.$route.name === 'SharedFolders' || this.$route.name === 'SharedFolderFiles' || this.$route.name === 'SharedFile') && this.$store.state.user === false) || (this.$route.path.substring(this.$route.path.length - 6) === '/login' && this.$store.state.user.role !== 1)) {
        return '0';
      }
      return `${this.isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH}px`;
    },
    getShareWidth(): string {
      if (((this.$route.name === 'SharedFolders' || this.$route.name === 'SharedFolderFiles' || this.$route.name === 'SharedFile') && this.$store.state.user === false) || (this.$route.path.substring(this.$route.path.length - 6) === '/login' && this.$store.state.user.role !== 1)) {
        return '0';
      }
      return `${this.isShareCollapsed ? SHARE_WIDTH_COLLAPSED : SHARE_WIDTH}px`;
    },
  },
  methods: {
    correctRouting() {
      let items: any = []
      this.$router.options.routes?.forEach(route => {
        items.push(route.name)
      })

      if (this.$route.name === 'SharedFolders' || this.$route.name === 'SharedFolderFiles' || this.$route.name === 'SharedFile') {
        return;
      }

      if (this.$store.state.user === false) {
        this.$router.push({name: 'Login', replace: true});
        return;
      }

      if (this.$store.state.user.role === 2) {
        if (this.$route.name === 'Branch' || this.$route.path === 'User') {
          this.$router.push({name: 'UserFolder', replace: true});
        }
      }

      if (!items.includes(this.$route.name) || (this.$route.name === 'Login' && this.$store.state.user !== false)) {
        if (this.$store.state.user.role === 1) {
          this.$router.push({name: 'Branch', replace: true});
        } else if (this.$store.state.user.role === 2) {
          this.$router.push({name: 'UserFolder', replace: true});
        }
      }

    },
  }
})
</script>

<style lang="scss">
@use './assets/scss/toast';
@use './assets/scss/colors';

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(136, 136, 136, 0.75);
}

::-webkit-scrollbar-thumb {
  background-color: #88888873;
  border-radius: 100rem;
  box-shadow: 2px 2px 4px #a8a8a8;
}

::-webkit-scrollbar-corner,
::-webkit-scrollbar-track,
::-webkit-scrollbar-track-piece {
  background-color: #0000000C;
}

::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.text-start {
  text-align: start;
}

.text-end {
  text-align: end;
}

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
