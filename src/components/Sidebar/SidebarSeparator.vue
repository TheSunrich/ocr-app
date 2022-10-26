<template>
  <transition name="fade-separator">
    <div class="link-separator" v-if="!isCollapsed">
      <hr>
      <h3>{{ text }}</h3>
    </div>
  </transition>
</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  name: "SidebarSeparator",
  props: {
    text: {type: String, required: true},
  },
  computed: {
    isCollapsed(): boolean {
      return this.$store.state.collapsed;
    }
  },
})
</script>

<style lang="scss">
$text-color: #707070;

.fade-separator-enter-active {
  transition: opacity 0.4s ease-in-out;
}

.fade-separator-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-separator-enter,
.fade-separator-leave-to {
  opacity: 0;
}

.link-separator {
  white-space: nowrap;
  color: $text-color;
  margin-top: 25px;

  h3 {
    margin-top: 8px;
    font-size: 0.9em;
    margin-left: 20px;
  }
}
</style>