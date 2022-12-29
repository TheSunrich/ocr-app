<template>
  <b-col sm="6" md="4" lg="3" xl="2" class="py-3">
    <b-card no-body class="btn-branch shadow-sm">
      <blockquote class="card-blockquote" @click="showFolders">
        <img class="btn-icon m-4" :src="require('../../assets/img/sucursal.png')" alt=""/>
        <h2>{{ branch.name }}</h2>
      </blockquote>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Branch from "@/models/branch";
import {emitter} from "@/main";

export default defineComponent({
  name: "BranchComponent",
  props: {
    branch: {type: Object as PropType<Branch>, required: true}
  },
  data() {
    return {
      show: false,
      nameState: null,
      cityState: null,
      stateState: null,
      editBranch: {
        name: this.branch.name,
        city: this.branch.city,
        state: this.branch.state,
      }
    }
  },
  methods: {
    showFolders() {
      this.$router.push({name: 'BranchFolder', params: {branch: JSON.stringify(this.branch)}})
    },
  },

})
</script>

<style scoped lang="scss">
@use 'sass:color';

$custom-orange: #fd7e14;
$custom-green: #36ce2b;
$custom-blue: #2747bb;
$custom-red: #ce2b2b;

@function top_space($btn_num) {
  @return 33 * $btn_num - 24;
}

.btn-branch {
  height: 100%;
  border: none;
  transition: background-color ease-in-out 0.15s;

  &:has(.list-enter-to) {
    opacity: 0;
  }

  &:hover {
    background-color: rgba(44, 62, 80, 0.15);
  }

  &:has(> .btn-update:hover) {
    background-color: #FFF;
  }

  &:has(> .btn-lock:hover) {
    background-color: #FFF;
  }

  &:has(> .btn-unlock:hover) {
    background-color: #FFF;
  }

  &:has(> .btn-delete:hover) {
    background-color: #FFF;
  }

  &:active {
    background-color: rgba(44, 62, 80, 0.45);
  }


  .btn-action {
    transition: background-color ease-in-out 0.25s, color ease-in-out 0.25s, transform ease-in-out 0.05s;
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    border-radius: 100rem;
    width: 26px;
    height: 26px;
    right: 9px;

    &.btn-update {
      top: #{top_space(1)}px;
      background-color: white;
      color: $custom-blue;

      &:hover {
        background-color: $custom-blue;
        color: white;
      }

      &:active {
        transform: scale(105%, 105%);
        background-color: color.adjust($custom-blue, $lightness: -15);
        color: white;
      }

      svg {
        display: block;
        align-self: auto;
      }
    }

    &.btn-lock {
      top: #{top_space(2)}px;
      background-color: white;
      color: $custom-orange;

      &:hover {
        background-color: $custom-orange;
        color: white;
      }

      &:active {
        transform: scale(105%, 105%);
        background-color: color.adjust($custom-orange, $lightness: -15);
        color: white;
      }

      svg {
        display: block;
        align-self: auto;
      }
    }

    &.btn-unlock {
      top: #{top_space(2)}px;
      background-color: white;
      color: $custom-green;

      &:hover {
        background-color: $custom-green;
        color: white;
      }

      &:active {
        transform: scale(105%, 105%);
        background-color: color.adjust($custom-green, $lightness: -15);
        color: white;
      }

      svg {
        display: block;
        align-self: auto;
      }
    }


    &.btn-delete {
      top: #{top_space(3)}px;
      background-color: white;
      color: $custom-red;

      &:hover {
        background-color: $custom-red;
        color: white;
      }

      &:active {
        transform: scale(105%, 105%);
        background-color: color.adjust($custom-red, $lightness: -15);
        color: white;
      }

      svg {
        display: block;
        align-self: auto;
      }
    }
  }

  .card-blockquote {
    user-select: none;

    .btn-icon {
      width: 50%;
      margin: 2.25rem !important;
    }

    h2 {
      margin: 0;
      padding: 0 10px;
      text-align: center;
      font-size: 15px;
    }
  }
}


</style>