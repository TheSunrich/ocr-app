<template>
  <b-col sm="6" md="4" lg="3" xl="2" class="py-3">
    <b-card no-body class="btn-branch shadow-sm">
      <blockquote class="card-blockquote" @click="showFileDetail">
        <font-awesome-icon class="btn-icon m-4" icon="fa-regular fa-file-pdf" size="4x"/>
        <h3>{{ file }}</h3>
      </blockquote>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Folder from "@/models/folder";
import {emitter} from "@/main";
import Branch from "@/models/branch";

export default defineComponent({
  name: "SharedFileComponent",
  props: {
    folder: {type: String, required: true},
    branch: {type: Branch, required: true},
    file: {type: String, required: true},
    shareCode: {type: String, required: true},
  },
  data() {
    return {}
  },
  methods: {
    showFileDetail() {
      this.$router.push({
        name: 'SharedFile',
        params: {branch: JSON.stringify(this.branch), code: this.folder, file_name: this.file, shared_code: this.shareCode}
      })
    },
  }
})
</script>

<style scoped lang="scss">

@function top_space($btn_num) {
  @return 33 * $btn_num - 24;
}

.btn-branch {
  border: none;
  transition: background-color ease-in-out 0.15s;

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
      color: #2747bb;

      &:hover {
        background-color: #2747bb;
        color: white;
      }

      &:active {
        transform: scale(105%, 105%);
        background-color: #1a2f7c;
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
      color: #ce2b2b;

      &:hover {
        background-color: #ce2b2b;
        color: white;
      }

      &:active {
        transform: scale(105%, 105%);
        background-color: #8f1e1e;
        color: white;
      }

      svg {
        display: block;
        align-self: auto;
      }
    }

    &.btn-restore {
      top: #{top_space(2)}px;
      background-color: white;
      color: #36ce2b;

      &:hover {
        background-color: #36ce2b;
        color: white;
      }

      &:active {
        transform: scale(105%, 105%);
        background-color: #36ce2b;
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
      margin: 0;
      padding: 0 10px;
      text-align: center;
      font-size: 20px;
    }

    h3 {
      margin: 0;
      padding: 0 10px;
      text-align: center;
      font-size: 14px;
    }
  }
}


</style>