<template>
  <b-col sm="6" md="4" lg="3" xl="2" class="py-3">
    <b-card no-body class="btn-branch shadow-sm">
      <a class="btn-action btn-update" v-b-modal="'modifyFolder-' + folder.idBranch + folder.name" v-if="!deleted && $store.state.user.idClient === null">
        <font-awesome-icon icon="fa-solid fa-pencil" size="sm"/>
      </a>
      <a class="btn-action btn-lock" @click="showModal('unlock')" v-if="folder.status === 2 && !deleted && $store.state.user.idClient === null">
        <font-awesome-icon icon="fa-solid fa-lock" size="sm"/>
      </a>
      <a class="btn-action btn-unlock" @click="showModal('lock')" v-if="folder.status === 1 && !deleted && $store.state.user.idClient === null">
        <font-awesome-icon icon="fa-solid fa-lock-open" size="xs"/>
      </a>
      <a class="btn-action btn-delete" @click="showModal('delete')" v-if="!deleted && $store.state.user.idClient === null">
        <font-awesome-icon icon="fa-solid fa-trash" size="sm"/>
      </a>
      <b-form-checkbox v-bind:checked="checked" class="folder-checkbox" v-if="$store.state.isShareActive"
                       @change="toggleShareList"/>
      <blockquote class="card-blockquote" @click="whenActivate">
        <font-awesome-icon class="btn-icon m-4" icon="fa-solid fa-folder" size="4x"/>
        <h2>{{ folder.name }}</h2>
        <h3 v-if="!deleted">{{ folder.branch.name }} </h3>
      </blockquote>
    </b-card>
    <b-modal
        :id="'modifyFolder-' + folder.idBranch + folder.name"
        title="Editar Valores"
        header-bg-variant="blue"
        header-text-variant="light"
        okVariant="danger"
        okTitle="Aceptar"
        cancelTitle="Cancelar"
        @show="resetForm"
        @hidden="resetForm"
        @ok="handleOk"
        centered>
      <b-form class="container-fluid" :ref="'modifyFolder-' + folder.idBranch + folder.name" @submit.stop.prevent="updateFolder">
        <b-form-group class="mb-3" label="Nombre de usuario:">
          <b-form-input id="name" name="name" type="text" v-model.trim="editFolder.new_name" required
                        :state="nameState"></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
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
    dateInit: {type: String, default: ''},
    dateEnd: {type: String, default: ''}
  },
  data(){
    return {
      nameState: null,
      editFolder: {
        new_name: this.folder.name,
      }
    }
  },
  computed: {
    checked: {
      get(): boolean {
        return !!this.$store.state.shareList.find((folder: Folder) => folder.name === this.folder.name && folder.idBranch === this.folder.idBranch)
      },
      set(newValue: boolean) {

      }
    }
  },
  methods: {
    checkFormValidity() {
      const form: any = this.$refs['modifyFolder-' + this.folder.idBranch + this.folder.name];
      this.nameState = form.name.checkValidity()
      return form.checkValidity();
    },
    updateFolder(){
      if (!this.checkFormValidity()) {
        return
      }

      const title = 'Modificación de usuario';
      let toastArgs = {};
      this.axios.put(`folder/${this.folder.idBranch}/${this.folder.name}`, this.editFolder).then(response => {
        if (response.data.hasOwnProperty('error')) {
          if (response.data.error.code === 416) {
            toastArgs = {
              title: title,
              description: 'La información de al usuario es idéntica, no ha habido cambios',
              type: 'warning'
            }
          } else {
            toastArgs = {
              title: title,
              description: 'Ha ocurrido un error inesperado',
              type: 'error'
            }
          }
          this.editFolder.new_name = this.folder.name;
          emitter.emit('show-toast', toastArgs);
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'El usuario se ha modificado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('folder-getList');
      }).catch(error => {
        console.log(error)
        this.editFolder.new_name = this.folder.name;
        if(error.response.hasOwnProperty('data')){
          emitter.emit('show-toast', toastArgs = {
            title: title,
            description: 'El usuario no ha podido ser modificado',
            type: 'error'
          });
          return;
        }
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 419:
              toastArgs = {
                title: title,
                description: 'El usuario ya ha sido eliminado y no hay permisos para modificar al usuario',
                type: 'error'
              }
              break;
            case 410:
              toastArgs = {
                title: title,
                description: 'El usuario no ha podido ser modificado',
                type: 'error'
              }
              break;
            case 414:
              toastArgs = {
                title: title,
                description: 'El usuario no existe',
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
      }).finally(() => {
        this.$bvModal.hide('modifyFolder-' + this.folder.idBranch + this.folder.name)
      })
    },
    handleOk(bvModalEvent: any) {
      bvModalEvent.preventDefault()
      this.updateFolder()
    },
    resetForm() {
      this.nameState = null;
      this.editFolder = {
        new_name: this.folder.name,
      }
    },
    whenActivate() {
      if (this.$store.state.isShareActive) {
        this.checked = !this.checked;
        this.toggleShareList();
        return;
      }
      if (this.deleted) {
        this.showDeletedFiles()
        return;
      }
      this.showFiles();
    },
    showFiles() {
      this.$router.push({
        name: 'FolderFiles',
        params: {
          branch: JSON.stringify(this.folder.branch),
          folder: String(this.folder.name),
          deleted: String(this.deleted),
          preRoute: String(this.$route.name),
          dateInit: this.dateInit,
          dateEnd: this.dateEnd
        }
      })
    },
    showModal(type: string) {
      let msg: string = '', title: string = '', color = '';
      switch (type) {
        case 'delete':
          msg = '¿Esta seguro de querer eliminar la carpeta?';
          title = 'Eliminar carpeta';
          color = 'red';
          break;
        case 'lock':
          msg = '¿Esta seguro de querer bloquear la carpeta?';
          title = 'Bloquear carpeta';
          color = 'orange';
          break;
        case 'unlock':
          msg = '¿Esta seguro de querer desbloquear la carpeta?';
          title = 'Desbloquear carpeta';
          color = 'green';
          break;
      }
      this.$bvModal.msgBoxConfirm(msg, {
        title: title,
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Aceptar',
        headerBgVariant: color,
        headerTextVariant: 'light',
        cancelTitle: 'Cancelar',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true,
        noCloseOnEsc: true,
        noCloseOnBackdrop: true
      }).then(value => {
        if (value) {
          switch (type) {
            case 'delete':
              this.deleteFolder();
              break;
            case 'lock':
              this.lockFolder();
              break;
            case 'unlock':
              this.unlockFolder();
              break;
          }
        }
      })
    },
    showDeletedFiles() {
      emitter.emit('file-getList', {deleted: true})
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
    toggleShareList() {
      let selectedFolder: Folder = this.$store.state.shareList.find((folder: Folder) => folder.name === this.folder.name && folder.idBranch === this.folder.idBranch);
      if (!!selectedFolder)
        this.$store.commit('deleteFolderInShareList', this.$store.state.shareList.indexOf(selectedFolder));
      else {
        this.$store.commit('addToShareList', this.folder);
      }
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
  height: 100%;
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