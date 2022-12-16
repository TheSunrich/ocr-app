<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12">
        <h1>Usuarios</h1>
      </b-col>
    </b-row>
    <b-row class="mb-4 mt-2">
      <b-col sm="9" md="10" xl="11">
        <b-form-input class="search-bar" v-model="txtSearch"
                      @update="search"></b-form-input>
      </b-col>
      <b-col sm="3" md="2" xl="1" class="d-flex align-content-center justify-content-center">
        <b-button block variant="green" pill v-b-modal.addUser>
          <font-awesome-icon icon="fa-solid fa-plus" size="xl"/>
        </b-button>
        <b-modal
            id="addUser"
            title="Agregar Nuevo Usuario"
            header-bg-variant="blue"
            header-text-variant="light"
            okVariant="danger"
            okTitle="Aceptar"
            cancelTitle="Cancelar"
            @show="emptyForm"
            @hidden="emptyForm"
            @ok="handleOk"
            centered>
          <b-form class="container-fluid" ref="addUser" @submit.stop.prevent="addUser">
            <b-form-group class="mb-3" label="Nombre: ">
              <b-form-input name="name" type="text" v-model.trim="newUser.name" required
                            :state="nameState"></b-form-input>
              <b-form-invalid-feedback>
                El campo 'Nombre' es requerido
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="mb-3" label="Email: ">
              <b-form-input name="email" type="email" v-model="newUser.email" required
                            :state="emailState"></b-form-input>
              <b-form-invalid-feedback>
                El campo 'Email' es requerido
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="mb-3" label="Rol: ">
              <b-form-select name="role" id="role" v-model="newUser.role" required :state="roleState">
                <b-form-select-option :value="1">1</b-form-select-option>
                <b-form-select-option :value="2">2</b-form-select-option>
                <b-form-select-option :value="3">3</b-form-select-option>
              </b-form-select>
              <b-form-invalid-feedback>
                El campo 'Rol' es requerido
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="mb-3" label="Sucursal: " v-if="newUser.role !== 1 && newUser.role !== null">
              <b-form-select name="role" id="role" v-model="newUser.idBranch" required :state="idBranchState">
                <b-form-select-option :value="1">1</b-form-select-option>
                <b-form-select-option :value="2">2</b-form-select-option>
                <b-form-select-option :value="3">3</b-form-select-option>
              </b-form-select>
              <b-form-invalid-feedback>
                El campo 'Sucursal' es requerido
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="mb-3" label="Contraseña: ">
              <b-input-group>
                <b-form-input name="pwd" :type="showPassword ? 'text' : 'password'" v-model.trim="newUser.pwd"
                              required :state="pwdState"></b-form-input>
                <b-input-group-append>
                  <b-button @click="showPassword = !showPassword" size="sm" variant="outline-blue">
                    <font-awesome-icon :icon=" showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"/>
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-form-group class="mb-3" label="Confirmar Contraseña: ">
              <b-input-group>
                <b-form-input name="pwd_2" :type="showPassword2 ? 'text' : 'password'" v-model.trim="pwd_check"
                              required :state="pwdState2"></b-form-input>
                <b-input-group-append>
                  <b-button @click="showPassword2 = !showPassword2" size="sm" variant="outline-blue">
                    <font-awesome-icon :icon=" showPassword2 ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"/>
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-form>
        </b-modal>
      </b-col>
    </b-row>
    <TransitionGroup name="list" tag="div" class="row" mode="out-in">
      <UserComponent v-for="user of searchUsers" :key="user.id" :user="user"/>
    </TransitionGroup>
  </b-container>
</template>

<script lang="ts">
import User from "@/models/user";
import UserComponent from "@/components/User/User.vue"
import {emitter} from "@/main";
import {defineComponent} from "vue";

export default defineComponent({
  name: "User",
  components: {
    UserComponent
  },
  data() {
    return {
      showPassword: false,
      showPassword2: false,
      txtSearch: '',
      users: [] as User[],
      searchUsers: [] as User[],
      emailState: null,
      pwdState: null,
      pwdState2: null as boolean | null,
      roleState: null,
      nameState: null,
      idBranchState: null,
      pwd_check: '',
      newUser: {
        email: '',
        pwd: '',
        role: null as number | null,
        name: '',
        idBranch: null,
      }
    }
  },
  created() {
    this.getAll();
  },
  mounted() {
    emitter.on('user-getAll', this.getAll);
  },
  methods: {
    checkFormValidity() {
      const form: any = this.$refs['addUser'];
      this.nameState = form.name.checkValidity()
      this.emailState = form.email.checkValidity();
      this.pwdState = form.pwd.checkValidity()
      this.pwdState2 = this.newUser.pwd !== '' && this.newUser.pwd === this.pwd_check && form.pwd_2.checkValidity()
      this.roleState = form.role.checkValidity()
      this.idBranchState = form.idBranch.checkValidity()
      return form.checkValidity() && this.newUser.pwd !== '' && this.newUser.pwd === this.pwd_check;
    },
    handleOk(bvModalEvent: any) {
      bvModalEvent.preventDefault()
      this.addUser()
    },
    search() {
      let filteredUser: User[] = [];
      if (this.txtSearch == '') {
        this.searchUsers = this.users;
        return;
      }
      this.users.map(user => {
        if (user.name.toLowerCase().includes(this.txtSearch.toLowerCase())) {
          filteredUser.push(user)
        }
      })
      this.searchUsers = filteredUser
    },
    emptyForm() {
      this.emailState = null;
      this.pwdState = null;
      this.pwdState2 = null as boolean | null;
      this.roleState = null;
      this.nameState = null;
      this.idBranchState = null;
      this.newUser = {
        email: '',
        pwd: '',
        role: null,
        name: '',
        idBranch: null,
      }
    },
    getAll() {
      this.axios.get('user').then(response => {
        if (response.data.hasOwnProperty('error')) {
          if (response.data.error.code == 440) {
            emitter.emit('show-toast', {
              title: 'Lista de usuarios',
              description: 'No se han encontrado usuarios',
              type: 'warning'
            });
          }
          return;
        }
        this.users = response.data;
        this.searchUsers = response.data;
      }).catch(error => {
        console.log(error);
      })
    },
    addUser() {
      if (!this.checkFormValidity()) {
        return
      }

      const title = 'Agregar Nuevo Usuario';
      let toastArgs = {};
      this.axios.post('user', this.newUser).then(response => {
        if (response.data.hasOwnProperty('error')) {
          toastArgs = {
            title: title,
            description: 'Ha ocurrido un error inesperado',
            type: 'error'
          }
          emitter.emit('show-toast', toastArgs);
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'El usuario se ha agregado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('user-getAll');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 430:
              toastArgs = {
                title: title,
                description: 'El usuario no ha podido ser agregado',
                type: 'error'
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
        this.emptyForm()
        this.$bvModal.hide('addUser');
      })
    }
  }
})
</script>

<style scoped lang="scss">

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-in-out;

  & > .btn-branch {
    transition: all 0.5s ease-in-out;
  }
}

.list-enter,
.list-leave-to {
  opacity: 0;

  & > .btn-branch {
    opacity: 0;
  }
}

.list-leave-active {
  position: absolute;
  top: 0;
  transform: translateX(200%);
}

.form-control.search-bar {
  border-radius: 100rem;

  &:focus {
    border-color: #a1fe86;
    box-shadow: 0 0 0 0.25rem #46fd0d40;
  }
}
</style>


