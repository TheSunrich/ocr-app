<template>
  <b-col sm="6" md="4" lg="3" xl="2" class="py-3">
    <b-card no-body class="btn-branch shadow-sm">
      <blockquote class="card-blockquote" @click="showFiles">
        <font-awesome-icon class="btn-icon m-4" icon="fa-solid fa-folder" size="4x" />
        <h2>{{ folder.name }}</h2>
        <h3 v-if="$route.name === 'Folder'">{{ folder.branch.name }} </h3>
      </blockquote>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Folder from "@/models/folder";

export default defineComponent({
  name: "SharedFolderComponent",
  props: {
    shareCode: {type: String, required: true},
    branchId: {type: Number, required: true},
    folder: {type: Object as PropType<Folder>, required: true},
  },
  methods: {
    showFiles() {
      this.$router.push({
        name: 'SharedFolderFiles',
        params:{
          shared_code: String(this.shareCode),
          folder: String(this.folder.name),
          branchId: String(this.branchId),
        }
      })
    },
  }
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
  border: none;
  transition: background-color ease-in-out 0.15s;

  &:hover {
    background-color: rgba(44, 62, 80, 0.15);
  }

  &:has(> .folder-checkbox), &:active:has(> .folder-checkbox) {
    background-color: #FFF;
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

  .folder-checkbox {
    position: absolute;
    transform: translate(10px, 6px);
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
      top: #{top_space(1)}px;
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
      top: #{top_space(1)}px;
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
      top: #{top_space(2)}px;
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
      margin: 2.25rem !important;
    }

    h2 {
      user-select: none;
      margin: 0;
      padding: 0 10px;
      text-align: center;
      font-size: 20px;
    }

    h3 {
      user-select: none;
      margin: 0;
      padding: 0 10px;
      text-align: center;
      font-size: 14px;
    }
  }
}


</style>