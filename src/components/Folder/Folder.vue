<template>
  <b-col sm="6" md="4" lg="3" xl="2" class="py-3">
    <b-card no-body class="btn-branch shadow-sm">
      <a class="btn-action btn-update" @click="updateFolder" v-if="!deleted">
        <font-awesome-icon icon="fa-solid fa-pencil" size="sm"/>
      </a>
      <a class="btn-action btn-lock" @click="unlockFolder" v-if="folder.status === 2 && !deleted">
        <font-awesome-icon icon="fa-solid fa-lock" size="sm"/>
      </a>
      <a class="btn-action btn-unlock" @click="lockFolder" v-else-if="folder.status === 1 && !deleted">
        <font-awesome-icon icon="fa-solid fa-lock-open" size="xs"/>
      </a>
      <a class="btn-action btn-delete" @click="deleteFolder" v-if="!deleted">
        <font-awesome-icon icon="fa-solid fa-trash" size="sm"/>
      </a>
      <b-form-checkbox v-model="status" class="folder-checkbox"/>
      <blockquote class="card-blockquote" @click="deleted ? showDeletedFiles() : showFiles()">
        <font-awesome-icon class="btn-icon m-4" icon="fa-solid fa-folder" size="4x"/>
        <h2>{{ folder.name }}</h2>
        <h3 v-if="$route.name === 'Folder'">{{ folder.branch.name }}</h3>
      </blockquote>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Folder from "@/models/folder";
import {emitter} from "@/main";

export default defineComponent({
  name: "FolderComponent",
  props: {
    folder: {type: Object as PropType<Folder>, required: true},
    deleted: {type: Boolean, default: false},
    index: {type: Number, required: true}
  },
  data(){
    return{
      status: false,
    }
  },
  methods: {
    showFiles() {
      this.$router.push({name: 'FolderFiles',
        params: {
          branch: JSON.stringify(this.folder.branch),
          folder: String(this.folder.name),
          deleted: String(this.deleted),
          preRoute: String(this.$route.name)
        }
      })
    },
    showDeletedFiles() {
      emitter.emit('file-getList', {deleted: true})
    },
    updateFolder() {
      //this.axios.put(`branch/${this.branch.id}`).then().catch()
    },
    lockFolder() {
      const title = 'Bloqueo de carpeta';
      let toastArgs = {};
      this.axios.patch(`folder/${this.folder.idBranch}/${this.folder.name}/lock`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'La carpeta se ha bloqueado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('folder-getList');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 469:
              toastArgs = {
                title: title,
                description: 'La carpeta ya ha sido eliminada y no hay permisos para reactivarla',
                type: 'error'
              }
              break;
            case 466:
              toastArgs = {
                title: title,
                description: 'La carpeta ya ha sido bloqueada',
                type: 'warning'
              }
              break;
            case 460:
              toastArgs = {
                title: title,
                description: 'La carpeta no ha podido ser bloqueada',
                type: 'error'
              }
              break;
            case 464:
              toastArgs = {
                title: title,
                description: 'La carpeta no existe',
                type: 'warning'
              }
              break;
            case 0:
            default:
              toastArgs = {
                title: title,
                description: 'Ha surgido un error inesperado',
                type: 'error'
              }
              break;
          }
          emitter.emit('show-toast', toastArgs);
        }
      })
    },
    unlockFolder() {
      const title = 'Desbloqueo de carpeta';
      let toastArgs = {};
      this.axios.patch(`folder/${this.folder.idBranch}/${this.folder.name}/activate`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'La carpeta se ha desbloqueado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('folder-getList');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 469:
              toastArgs = {
                title: title,
                description: 'La carpeta ya ha sido eliminada y no hay permisos para reactivarla',
                type: 'error'
              }
              break;
            case 466:
              toastArgs = {
                title: title,
                description: 'La carpeta ya ha sido desbloqueada',
                type: 'warning'
              }
              break;
            case 460:
              toastArgs = {
                title: title,
                description: 'La carpeta no ha podido ser desbloqueada',
                type: 'error'
              }
              break;
            case 464:
              toastArgs = {
                title: title,
                description: 'La carpeta no existe',
                type: 'warning'
              }
              break;
            case 0:
            default:
              toastArgs = {
                title: title,
                description: 'Ha surgido un error inesperado',
                type: 'error'
              }
              break;
          }
          emitter.emit('show-toast', toastArgs);
        }
      })
    },
    deleteFolder() {
      const title = 'Eliminación de carpeta';
      let toastArgs = {};
      this.axios.patch(`folder/${this.folder.idBranch}/${this.folder.name}/delete`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'La carpeta se ha eliminado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('folder-getList');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 426:
              toastArgs = {
                title: title,
                description: 'La carpeta ya ha sido eliminada',
                type: 'warning'
              }
              break;
            case 420:
              toastArgs = {
                title: title,
                description: 'La carpeta no ha podido ser eliminada',
                type: 'error'
              }
              break;
            case 414:
              toastArgs = {
                title: title,
                description: 'La carpeta no existe',
                type: 'warning'
              }
              break;
            case 0:
            default:
              toastArgs = {
                title: title,
                description: 'Ha surgido un error inesperado',
                type: 'error'
              }
              break;
          }
          emitter.emit('show-toast', toastArgs);
        }
      })
    },
    addToShare(){
      
    },
    removeFromShare(){
      
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

  &:has(> .folder-checkbox:hover) {
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

  .folder-checkbox{
    position: absolute;
    transform: translate(10px, 10px);
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
        background-color: #243a77;
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
      color: #ce7d2b;

      &:hover {
        background-color: #ce7d2b;
        color: white;
      }

      &:active {
        transform: scale(105%, 105%);
        background-color: #8d6228;
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
      color: #36ce2b;

      &:hover {
        background-color: #36ce2b;
        color: white;
      }

      &:active {
        transform: scale(105%, 105%);
        background-color: #2f9827;
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
      color: #ce2b2b;

      &:hover {
        background-color: #ce2b2b;
        color: white;
      }

      &:active {
        transform: scale(105%, 105%);
        background-color: #962525;
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