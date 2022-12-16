<template>
  <div class="sidebar" :style="{ width:sidebarW }" :class="{'sidebar-expanded': !isCollapsed}">

    <div class="sidebar-header" @click="toggle">
      <span class="collapse-icon" :class="{'rotate-180': isCollapsed}">
        <font-awesome-icon class="fa-xl" icon="fa-solid fa-bars"/>
      </span>
      <transition name="fade">
        <span :class="{'sidebar-header-title': !isCollapsed}" v-if="!isCollapsed">OCR</span>
      </transition>
    </div>

    <SidebarLink name="Sucursales" to="/branch" icon="fa-solid fa-code-branch"/>
    <SidebarLink name="Carpetas" to="/folder" icon="fa-solid fa-folder"/>
    <SidebarLink name="Usuarios" to="/user" icon="fa-solid fa-users"/>


  </div>
</template>

<script lang="ts">
import SidebarLink from "@/components/Sidebar/SidebarLink.vue";
import SidebarSeparator from "@/components/Sidebar/SidebarSeparator.vue";
import {emitter} from "@/main";
import {defineComponent} from "vue";

const SIDEBAR_WIDTH = 200;
const SIDEBAR_WIDTH_COLLAPSED = 70;

export default defineComponent({
  name: "Sidebar",
  props: {},
  components: {
    SidebarLink,
    SidebarSeparator
  },
  data() {
    return {
      sidebarW: "",
    }
  },
  mounted() {
    this.sidebarW = this.getSidebarWidth;
  },
  computed: {
    isCollapsed(): boolean {
      return this.$store.state.collapsed;
    },
    getSidebarWidth(): string {
      return `${this.isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH}px`;
    }
  },
  methods: {
    toggle() {
      this.$store.commit('toggleSidebar');
      this.sidebarW = this.getSidebarWidth;
    },
  }
})
</script>


<style lang="scss">

$sidebar-bg-color: #007336;
$text-color: #eef5ee;
$text-color-exp: #007336;

.fade-enter-active {
  transition: opacity 0.4s;
}

.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.sidebar {
  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;

  transition: width 0.5s ease-in-out, background-color ease-in-out 0.5s;

  display: flex;
  flex-direction: column;

  .sidebar-header {
    white-space: nowrap;
    cursor: pointer;
    padding: 10px 0;

    span {
      vertical-align: middle;
    }

    .fa-xl {
      font-size: 1.75em;
    }

    .sidebar-header-title {
      font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      padding: 0;
    }
  }

  &.sidebar-expanded {
    color: $text-color-exp;
    text-align: left;
    background-color: #eef5ee;

    .collapse-icon {
      padding: 0.75em;
      margin-left: 10px;

      color: $text-color-exp;
      display: inline-block;

      transition: 0.2s linear;
    }
  }

  &:not(.sidebar-expanded) {
    color: $text-color;
    text-align: center;
    background-color: #007336;

    .collapse-icon {
      padding: 0.75em;
      margin: 0;

      color: $text-color;
      display: inline-block;

      transition: 0.2s linear;
    }
  }
}

.rotate-180 {
  transform: rotate(180deg);
  transition: 0.2s linear;
}

</style>

