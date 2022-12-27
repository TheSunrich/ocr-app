<template>
  <b-col sm="6" md="4" lg="3" xl="2" class="py-3">
    <b-card no-body class="btn-branch shadow-sm">
      <a class="btn-action btn-update" v-b-modal="'modifyBranch-' + branch.id">
        <font-awesome-icon icon="fa-solid fa-pencil" size="sm"/>
      </a>
      <a class="btn-action btn-lock" @click="showModal('unlock')" v-if="branch.status === 2">
        <font-awesome-icon icon="fa-solid fa-lock" size="sm"/>
      </a>
      <a class="btn-action btn-unlock" @click="showModal('lock')" v-else-if="branch.status === 1">
        <font-awesome-icon icon="fa-solid fa-lock-open" size="sm"/>
      </a>
      <a class="btn-action btn-delete" @click="showModal('delete')">
        <font-awesome-icon icon="fa-solid fa-trash" size="sm"/>
      </a>
      <blockquote class="card-blockquote" @click="showFolders">
        <font-awesome-icon class="btn-icon m-4" icon="fa-solid fa-code-branch" size="4x"/>
        <h2>{{ branch.name }}</h2>
      </blockquote>
    </b-card>
    <b-modal
        :id="'modifyBranch-' + branch.id"
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
      <b-form class="container-fluid" :ref="'modifyForm-'+branch.id" @submit.stop.prevent="updateBranch">
        <b-form-group
            :state="nameState">
          <b-form-input type="text" name="name" v-model.trim="editBranch.name" placeholder="Nombre" required
                        :state="nameState"></b-form-input>
          <b-form-invalid-feedback>
            El campo 'Nombre' es requerido
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            :state="cityState">
          <b-form-input type="text" name="city" v-model.trim="editBranch.city" placeholder="Ciudad" required
                        :state="cityState"></b-form-input>
          <b-form-invalid-feedback>
            El campo 'Ciudad' es requerido
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            :state="stateState">
          <b-form-input type="text" name="state" v-model.trim="editBranch.state" placeholder="Estado"
                        required :state="stateState"></b-form-input>
          <b-form-invalid-feedback>
            El campo 'Estado' es requerido
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>
    </b-modal>
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
    showModal(type: string) {
      let msg: string = '', title: string = '', color = '';
      switch (type) {
        case 'delete':
          msg = '¿Esta seguro de querer eliminar la sucursal?';
          title = 'Eliminar sucursal';
          color = 'red';
          break;
        case 'lock':
          msg = '¿Esta seguro de querer bloquear la sucursal?';
          title = 'Bloquear sucursal';
          color = 'orange';
          break;
        case 'unlock':
          msg = '¿Esta seguro de querer desbloquear la sucursal?';
          title = 'Desbloquear sucursal';
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
              this.deleteBranch();
              break;
            case 'lock':
              this.lockBranch();
              break;
            case 'unlock':
              this.unlockBranch();
              break;
          }
        }
      })
    },
    checkFormValidity() {
      const form: any = this.$refs[`modifyForm-${this.branch.id}`];
      this.nameState = form.name.checkValidity();
      this.cityState = form.city.checkValidity()
      this.stateState = form.state.checkValidity()
      return form.checkValidity();
    },
    handleOk(bvModalEvent: any) {
      bvModalEvent.preventDefault()
      this.updateBranch()
    },
    resetForm() {
      this.nameState = null;
      this.cityState = null;
      this.stateState = null;
      this.editBranch = {
        name: this.branch.name,
        city: this.branch.city,
        state: this.branch.state,
      }
    },
    updateBranch() {
      if (!this.checkFormValidity()) {
        return;
      }
      const title = 'Modificación de sucursal';
      let toastArgs = {};
      this.axios.put(`branch/${this.branch.id}`, this.editBranch).then(response => {
        if (response.data.hasOwnProperty('error')) {
          if (response.data.error.code === 416) {
            toastArgs = {
              title: title,
              description: 'La información de la sucursal es idéntica, no ha habido cambios',
              type: 'warning'
            }
          } else {
            toastArgs = {
              title: title,
              description: 'Ha ocurrido un error inesperado',
              type: 'error'
            }
          }
          this.editBranch.name = this.branch.name;
          this.editBranch.city = this.branch.city;
          this.editBranch.state = this.branch.state;
          emitter.emit('show-toast', toastArgs);
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'La sucursal se ha modificado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('branch-getAll');
      }).catch(error => {
        this.editBranch.name = this.branch.name;
        this.editBranch.city = this.branch.city;
        this.editBranch.state = this.branch.state;
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 419:
              toastArgs = {
                title: title,
                description: 'La sucursal ya ha sido eliminada y no hay permisos para modificar la sucursal',
                type: 'error'
              }
              break;
            case 410:
              toastArgs = {
                title: title,
                description: 'La sucursal no ha podido ser modificada',
                type: 'error'
              }
              break;
            case 414:
              toastArgs = {
                title: title,
                description: 'La sucursal no existe',
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
        this.$bvModal.hide('modifyBranch-' + this.branch.id)
      })
    },
    lockBranch() {
      const title = 'Bloqueo de sucursal';
      let toastArgs = {};
      this.axios.patch(`branch/${this.branch.id}/lock`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'La sucursal se ha bloqueado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('branch-getAll');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 469:
              toastArgs = {
                title: title,
                description: 'La sucursal ya ha sido eliminada y no hay permisos para reactivar la sucursal',
                type: 'error'
              }
              break;
            case 466:
              toastArgs = {
                title: title,
                description: 'La sucursal ya ha sido bloqueada',
                type: 'warning'
              }
              break;
            case 460:
              toastArgs = {
                title: title,
                description: 'La sucursal no ha podido ser bloqueada',
                type: 'error'
              }
              break;
            case 464:
              toastArgs = {
                title: title,
                description: 'La sucursal no existe',
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
    unlockBranch() {
      const title = 'Desbloqueo de sucursal';
      let toastArgs = {};
      this.axios.patch(`branch/${this.branch.id}/activate`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'La sucursal se ha desbloqueado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('branch-getAll');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 469:
              toastArgs = {
                title: title,
                description: 'La sucursal ya ha sido eliminada y no hay permisos para reactivar la sucursal',
                type: 'error'
              }
              break;
            case 460:
              toastArgs = {
                title: title,
                description: 'La sucursal no ha podido ser desbloqueada',
                type: 'error'
              }
              break;
            case 464:
              toastArgs = {
                title: title,
                description: 'La sucursal no existe',
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
    deleteBranch() {
      const title = 'Eliminación de sucursal';
      let toastArgs = {};
      this.axios.patch(`branch/${this.branch.id}/delete`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'La sucursal se ha eliminado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('branch-getAll');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 426:
              toastArgs = {
                title: title,
                description: 'La sucursal ya ha sido eliminada',
                type: 'warning'
              }
              break;
            case 420:
              toastArgs = {
                title: title,
                description: 'La sucursal no ha podido ser eliminada',
                type: 'error'
              }
              break;
            case 414:
              toastArgs = {
                title: title,
                description: 'La sucursal no existe',
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