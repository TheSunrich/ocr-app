<template>
  <div class="custom_toast">
    <h3>{{ title }}</h3>
    <span>{{ description }}</span>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  name: "Toast",
  props:{
    title: {type: String, required:true},
    description: {type: String, required:true},
  }
})
</script>

<style lang="scss">
$text-color: white ;

.custom_toast {
  font-size: 12px;
  font-family: arial, sans-serif;

  h3 {
    font-family: arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 0.25em;
  }

  hr {
    border-color: $text-color;
    border-style: solid;
    background-color: $text-color;
    border-width: 0.25px;
  }
}
</style>