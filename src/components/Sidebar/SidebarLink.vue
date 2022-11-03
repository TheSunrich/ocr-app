<template>
  <router-link :is="isDisabled ? 'span' : 'router-link'" :to="to" class="link" :class="{ active: isActive, disabled: isDisabled }">
    <font-awesome-icon class="icon" :icon="icon"/>
    <transition name="fade">
      <span v-if="!isCollapsed">
        {{ name }}
      </span>
    </transition>
  </router-link>
</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  name: "SidebarLink",
  props: {
    to: {type: String, required: true},
    icon: {type: String, required: true},
    name: {type: String, required: true},
    isDisabled: {type: Boolean, default: false}
  },
  computed: {
    isCollapsed(): boolean {
      return this.$store.state.collapsed;
    },
    isActive(): boolean {
      return this.$route.path === this.to;
    }
  },
})
</script>

<style lang="scss">
$sidebar-item: linear-gradient(to left, #00CC5F, #00B856, #00A34C, #008F43, #007336);
$text-color: #707070;
$text-color-exp: #F1F0EF;
$text-color-hover: #384dd4;

$icon-size: 1.15em;

.sidebar {
  &.sidebar-expanded {
    .link {
      color: $text-color;
      border-radius: 0 100px 100px 0;

      &:hover, &.active {
        color: $text-color-exp;
        background: $sidebar-item;
        border-left: 0 solid white;
      }

      &.disabled:hover, &.disabled {
        background: #89c498;
        color: white;
      }

      .icon {
        width: 25px;
        margin: 0 10px;
      }
    }
  }

  &:not(.sidebar-expanded) {
    .link {
      color: $text-color-exp;
      border-radius: 0 100px 100px 0;

      &:hover {
        color: $text-color-exp;
        background: transparent;
        border-left: 4px solid white;
      }

      &.active {
        color: $text-color-exp;
        background: transparent;
        border-left: 4px solid white;
      }

      .icon {
        width: 100%;
        margin: 0;
      }
    }
  }

  .link {
    display: flex;
    align-items: center;

    cursor: pointer;
    position: relative;
    font-weight: 400;
    user-select: none;

    margin: 0.1em 0;
    padding: 0.4em;
    border-radius: 0.25em;
    height: 3.25em;

    text-decoration: none;
    transition: color 0.3s ease-in-out;

    &:hover, &.active {
      transition: all 0.1s ease-in-out;
    }

    .icon {
      transition: width 0.3s ease-in-out,
      margin 0.3s ease-in-out;
      flex-shrink: 0;
      font-size: $icon-size;
    }
  }
}

</style>