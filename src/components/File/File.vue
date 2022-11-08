<template>
  <b-col sm="6" md="4" lg="3" xl="2" class="py-3">
    <b-card no-body class="btn-branch shadow-sm">
      <a class="btn-action btn-update" @click="updateBranch">
        <font-awesome-icon icon="fa-solid fa-pencil" size="sm"/>
      </a>
      <a class="btn-action btn-delete" @click="deleteFile" v-if="!isDeleted">
        <font-awesome-icon icon="fa-solid fa-trash" size="sm"/>
      </a>
      <a class="btn-action btn-restore" @click="restoreFile" v-if="isDeleted">
        <font-awesome-icon icon="fa-solid fa-arrow-rotate-left" size="sm"/>
      </a>
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
  name: "FileComponent",
  props: {
    folder: {type: String, required: true},
    branch: {type: Branch, required: true},
    file: {type: String, required: true},
    preRoute: {type: String, required: true},
    isDeleted: {type: Boolean, required: true}
  },
  data() {
    return {}
  },
  methods: {
    showFileDetail() {
      this.$router.push({
        name: 'File',
        params: {branch: JSON.stringify(this.branch), code: this.folder, file_name: this.file, preRoute: this.preRoute}
      })
    },
    updateBranch() {
      //this.axios.put(`branch/${this.branch.id}`).then().catch()
    },
    deleteFile() {
      let toastArgs = {}
      let title = "Eliminación de archivo"
      this.axios.put(`file/${this.branch.name}/${this.folder}/${this.file}/delete`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'El archivo se ha eliminado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('file-getList',{deleted: this.isDeleted})
      }).catch()
    },
    restoreFile() {
      let toastArgs = {}
      let title = "Restauración de archivo"
      this.axios.put(`file/${this.branch.name}/${this.folder}/${this.file}/restore`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'El archivo se ha restaurado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('file-getList',{deleted: this.isDeleted})
      }).catch()
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