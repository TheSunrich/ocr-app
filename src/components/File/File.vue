<template>
  <b-col sm="6" md="4" lg="3" xl="2" class="py-3">
    <b-card no-body class="btn-branch shadow-sm" >
      <a class="btn-action btn-update" v-b-modal="'modifyFile-' + file">
        <font-awesome-icon icon="fa-solid fa-pencil" size="sm"/>
      </a>
      <a class="btn-action btn-delete" @click="showModal('delete')" v-if="!isDeleted">
        <font-awesome-icon icon="fa-solid fa-trash" size="sm"/>
      </a>
      <a class="btn-action btn-restore" @click="showModal('restore')" v-if="isDeleted">
        <font-awesome-icon icon="fa-solid fa-arrow-rotate-left" size="sm"/>
      </a>
      <blockquote class="card-blockquote" @click="showFileDetail">
        <font-awesome-icon class="btn-icon m-4" icon="fa-regular fa-file-pdf" size="4x"/>
        <h3>{{ file }}</h3>
      </blockquote>
    </b-card>
    <b-modal
        :id="'modifyFile-' + file"
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
      <b-form class="container-fluid" :ref="'modifyForm-'+file" @submit.stop.prevent="updateFile">
        <b-form-group class="mb-3" label="Nombre del archivo:">
          <b-form-input id="name" name="name" type="text" v-model.trim="editFile.name" required
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
    return {
      nameState: null,
      editFile:{
        name: ''
      }
    }
  },
  methods: {
    handleOk(bvModalEvent: any) {
      bvModalEvent.preventDefault()
      this.updateFile()
    },
    resetForm() {
      this.nameState = null;
      this.editFile = {
        name: this.file,
      }
    },
    showModal(type: string) {
      let msg: string = '', title: string = '', color = '';
      switch (type) {
        case 'delete':
          msg = '¿Esta seguro de querer eliminar el archivo?';
          title = 'Eliminar archivo';
          color = 'red';
          break;
        case 'restore':
          msg = '¿Esta seguro de querer restaurar el archivo?';
          title = 'Restaurar archivo';
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
              this.deleteFile();
              break;
            case 'restore':
              this.restoreFile();
              break;
          }
        }
      })
    },
    showFileDetail() {
      this.$router.push({
        name: 'File',
        params: {branch: JSON.stringify(this.branch), code: this.folder, file_name: this.file, preRoute: this.preRoute}
      })
    },
    updateFile() {
      let title = "Modificación de archivo"
      let toastArgs = {}
      this.axios.patch(`file/${this.branch.name}/${this.folder}/${this.file}`, {new_file_name: this.editFile.name}).then(response => {
        if (response.data.hasOwnProperty('error')) {
          emitter.emit('show-toast',{
            title: title,
            description: 'El archivo no se ha modificado',
            type: 'error'
          })
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'El archivo se ha modificado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('file-getList',{deleted: this.isDeleted})
      }).catch( error => {
        emitter.emit('show-toast',{
          title: title,
          description: 'El archivo no se ha modificado',
          type: 'error'
        })
      })
    },
    deleteFile() {
      let toastArgs = {}
      let title = "Eliminación de archivo"
      this.axios.put(`file/${this.branch.name}/${this.folder}/${this.file}/delete`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          emitter.emit('show-toast',{
            title: title,
            description: 'El archivo no se ha eliminado',
            type: 'error'
          })
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
      }).catch(error =>{
        console.log(error)
        emitter.emit('show-toast',{
            title: title,
            description: 'El archivo no se ha eliminado',
            type: 'error'
          })
      })
    },
    restoreFile() {
      let toastArgs = {}
      let title = "Restauración de archivo"
      this.axios.put(`file/${this.branch.name}/${this.folder}/${this.file}/restore`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          emitter.emit('show-toast',{
            title: title,
            description: 'El archivo no se ha restaurado',
            type: 'error'
          })
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
      }).catch(error =>{
        console.log(error)
        emitter.emit('show-toast',{
          title: title,
          description: 'El archivo no se ha restaurado',
          type: 'error'
        })
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
  height: 100%;
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