<template>
  <b-col sm="6" md="4" lg="3" xl="2" class="py-3">
    <b-card no-body class="btn-user shadow-sm">
      <a class="btn-action btn-update" v-b-modal="'modifyUser-' + user.id">
        <font-awesome-icon icon="fa-solid fa-pencil" size="sm"/>
      </a>
      <a class="btn-action btn-lock" @click="showModal('unlock')" v-if="user.status === 2">
        <font-awesome-icon icon="fa-solid fa-lock" size="sm"/>
      </a>
      <a class="btn-action btn-unlock" @click="showModal('lock')" v-else-if="user.status === 1">
        <font-awesome-icon icon="fa-solid fa-lock-open" size="sm"/>
      </a>
      <a class="btn-action btn-delete" @click="showModal('delete')">
        <font-awesome-icon icon="fa-solid fa-trash" size="sm"/>
      </a>
      <blockquote class="card-blockquote" @click="showUserDetail">
        <font-awesome-icon class="btn-icon m-4" icon="fa-solid fa-user" size="4x"/>
        <h2>{{ user.name }}</h2>
      </blockquote>
    </b-card>
    <b-modal
        :id="'modifyUser-' + user.id"
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
      <b-form class="container-fluid" :ref="'modifyForm-'+user.id" @submit.stop.prevent="updateUser">
        <b-form-group class="mb-3" label="Nombre:">
          <b-form-input id="name" name="name" type="text" v-model.trim="editUser.name" required
                        :state="nameState"></b-form-input>
          <b-form-invalid-feedback>
            El campo 'Nombre' es requerido
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-3" label="Email:">
          <b-form-input id="email" name="email" type="email" v-model.trim="editUser.email" required
                        :state="emailState"></b-form-input>
          <b-form-invalid-feedback>
            El campo 'Email' es requerido
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-3" label="Rol:">
          <b-form-select name="role" id="role" v-model="editUser.role" required :state="roleState">
            <b-form-select-option :value="1">1</b-form-select-option>
            <b-form-select-option :value="2">2</b-form-select-option>
            <b-form-select-option :value="3">3</b-form-select-option>
          </b-form-select>
          <b-form-invalid-feedback>
            El campo 'Rol' es requerido
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-3" label="Sucursal: " v-if="editUser.role !== 1 && editUser.role !== null">
          <b-form-select name="role" id="role" v-model="editUser.idBranch" required :state="idBranchState">
            <b-form-select-option :value="1">1</b-form-select-option>
            <b-form-select-option :value="2">2</b-form-select-option>
            <b-form-select-option :value="3">3</b-form-select-option>
          </b-form-select>
          <b-form-invalid-feedback>
            El campo 'Sucursal' es requerido
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-3" label="Nueva Contraseña: " :state="pwdState">
          <b-input-group>
            <b-form-input id="pwd" name="pwd" :type="showPassword ? 'text' : 'password'" v-model.trim="editUser.pwd"
                          required :state="pwdState"></b-form-input>
            <b-input-group-append>
              <b-button @click="showPassword = !showPassword" size="sm" variant="outline-blue">
                <font-awesome-icon :icon=" showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
          <b-form-invalid-feedback>
            El campo 'Nueva Contraseña' es requerido
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="mb-3" label="Confirmar Contraseña: ">
          <b-input-group>
            <b-form-input id="pwd_2" name="pwd_2" :type="showPassword2 ? 'text' : 'password'" v-model.trim="pwd_check"
                          required :state="pwdState2"></b-form-input>
            <b-input-group-append>
              <b-button @click="showPassword2 = !showPassword2" size="sm" variant="outline-blue">
                <font-awesome-icon :icon=" showPassword2 ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
          <b-form-invalid-feedback>
            El campo 'Confirmar Contraseña' es requerido
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>
    </b-modal>
  </b-col>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import User from "@/models/user";
import {emitter} from "@/main";

export default defineComponent({
  name: "UserComponent",
  props: {
    user: {type: Object as PropType<User>, required: true},
  },
  data() {
    return {
      showPassword: false,
      showPassword2: false,
      show: false,
      emailState: null,
      pwdState: null,
      pwdState2: null as boolean | null,
      roleState: null,
      nameState: null,
      idBranchState: null,
      pwd_check: '',
      editUser: {
        email: this.user.email,
        pwd: '',
        role: this.user.role as number | null,
        name: this.user.name,
        idBranch: this.user.idBranch,
      }
    }
  },
  methods: {
    showUserDetail() {
      console.log(this.user)
    },
    checkFormValidity() {
      const form: any = this.$refs['modifyForm-' + this.user.id];
      this.nameState = form.name.checkValidity()
      this.emailState = form.email.checkValidity();
      this.pwdState = form.pwd.checkValidity()
      this.pwdState2 = this.editUser.pwd !== '' && this.editUser.pwd === this.pwd_check && form.pwd_2.checkValidity()
      this.roleState = form.role.checkValidity()
      this.idBranchState = form.idBranch.checkValidity()
      return form.checkValidity() && this.editUser.pwd !== '' && this.editUser.pwd === this.pwd_check;
    },
    showModal(type: string) {
      let msg: string = '', title: string = '', color = '';
      switch (type) {
        case 'delete':
          msg = '¿Esta seguro de querer eliminar al usuario?';
          title = 'Eliminar usuario';
          color = 'red';
          break;
        case 'lock':
          msg = '¿Esta seguro de querer bloquear al usuario?';
          title = 'Bloquear usuario';
          color = 'orange';
          break;
        case 'unlock':
          msg = '¿Esta seguro de querer desbloquear al usuario?';
          title = 'Desbloquear usuario';
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
              this.deleteUser();
              break;
            case 'lock':
              this.lockUser();
              break;
            case 'unlock':
              this.unlockUser();
              break;
          }
        }
      })
    },
    handleOk(bvModalEvent: any) {
      bvModalEvent.preventDefault()
      this.updateUser()
    },
    resetForm() {
      this.emailState = null;
      this.pwdState = null;
      this.pwdState2 = null;
      this.roleState = null;
      this.nameState = null;
      this.pwd_check = '';
      this.editUser = {
        email: this.user.email,
        pwd: '',
        role: this.user.role,
        name: this.user.name,
        idBranch: undefined,
      }
    },
    updateUser() {
      if (!this.checkFormValidity()) {
        return
      }

      const title = 'Modificación de usuario';
      let toastArgs = {};
      this.axios.put(`user/${this.user.id}`, this.editUser).then(response => {
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
          this.editUser.email = this.user.email;
          this.editUser.pwd = this.user.pwd;
          this.editUser.role = this.user.role;
          this.editUser.name = this.user.name;
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
        emitter.emit('user-getAll');
      }).catch(error => {
        this.editUser.email = this.user.email;
        this.editUser.pwd = this.user.pwd;
        this.editUser.role = this.user.role;
        this.editUser.name = this.user.name;
        this.editUser.idBranch = this.user.idBranch;
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
                description: 'El usuario no ha podido ser modificada',
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
        this.$bvModal.hide('modifyUser-' + this.user.id)
      })
    },
    lockUser() {
      const title = 'Bloqueo de usuario';
      let toastArgs = {};
      this.axios.patch(`user/${this.user.id}/lock`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'El usuario se ha bloqueado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('user-getAll');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 469:
              toastArgs = {
                title: title,
                description: 'El usuario ya ha sido eliminado y no hay permisos para reactivar al usuario',
                type: 'error'
              }
              break;
            case 466:
              toastArgs = {
                title: title,
                description: 'El usuario ya ha sido bloqueada',
                type: 'warning'
              }
              break;
            case 460:
              toastArgs = {
                title: title,
                description: 'El usuario no ha podido ser bloqueada',
                type: 'error'
              }
              break;
            case 464:
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
      })
    },
    unlockUser() {
      const title = 'Desbloqueo de usuario';
      let toastArgs = {};
      this.axios.patch(`user/${this.user.id}/activate`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'El usuario se ha desbloqueado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('user-getAll');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 469:
              toastArgs = {
                title: title,
                description: 'El usuario ya ha sido eliminado y no hay permisos para reactivar al usuario',
                type: 'error'
              }
              break;
            case 460:
              toastArgs = {
                title: title,
                description: 'El usuario no ha podido ser desbloqueada',
                type: 'error'
              }
              break;
            case 464:
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
      })
    },
    deleteUser() {
      const title = 'Eliminación de usuario';
      let toastArgs = {};
      this.axios.patch(`user/${this.user.id}/delete`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'El usuario se ha eliminado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('user-getAll');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 426:
              toastArgs = {
                title: title,
                description: 'El usuario ya ha sido eliminado',
                type: 'warning'
              }
              break;
            case 420:
              toastArgs = {
                title: title,
                description: 'El usuario no ha podido ser eliminado',
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

.btn-user {
  min-height: 150px;
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
      font-size: 20px;
    }
  }
}
</style>