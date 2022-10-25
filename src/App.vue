<template>
  <div id="app">
    <Sidebar/>
    <div class="app_container" :style="{marginLeft: getSidebarWidth}">
      <Navbar/>
      <router-view/>
    </div>
  </div>
</template>

<script type="ts">
import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";
import Toast from "@/components/Toast/Toast";
import {emitter} from "@/main";
import Vue from "vue";

const SIDEBAR_WIDTH = 220;
const SIDEBAR_WIDTH_COLLAPSED = 70;

export default Vue.extend({
  components: {Navbar, Sidebar},
  mounted() {
    emitter.on('show-toast', (args) => {
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
    emitter.emit('show-toast', {
      title: 'Prueba',
      description: 'Esta es una prueba del toast',
      type: 'success'
    });
  },
  computed: {
    isCollapsed() {
      return this.$store.state.collapsed;
    },
    getSidebarWidth() {
      if (this.$route.path.substring(this.$route.path.length - 6) === '/login') {
        return '0';
      }
      return `${this.isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH}px`;
    },
  },
  methods: {

  }
})
</script>

<style lang="scss">
@import './assets/scss/toast';

html{
  overflow-y: auto !important;
}

body {
  background-color: #F1F0EF;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
