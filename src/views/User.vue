<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12">
        <h1>Usuarios</h1>
      </b-col>
    </b-row>
    <b-row class="mb-4 mt-2">
      <b-col sm="9" md="10" xl="11">
        <b-form-input class="search-bar" v-model="txtSearch" placeholder="Búsqueda" type="search" size="lg"
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
            <b-form-group class="mb-3" label="Nombre de usuario:">
              <b-form-input id="username" name="username" type="text" v-model.trim="newUser.username" required
                            :state="usernameState"></b-form-input>
            </b-form-group>
            <b-form-group class="mb-3" label="Rol:">
              <b-form-select name="role" v-model="newUser.role" :options="options" required :state="roleState"/>
            </b-form-group>
            <b-form-group class="mb-3" label="Nueva Contraseña: " :state="pwdState">
              <b-form-input id="pwd" name="pwd" type="password" v-model.trim="newUser.pwd"
                            required :state="pwdState"></b-form-input>
              <b-form-invalid-feedback>
                El campo 'Nueva Contraseña' es requerido
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="mb-3" label="Confirmar Contraseña: ">
              <b-form-input id="pwd_2" name="pwd_2" type="password" v-model.trim="pwd_check"
                            required :state="pwdState2"></b-form-input>
              <b-form-invalid-feedback>
                El campo 'Confirmar Contraseña' es requerido
              </b-form-invalid-feedback>
            </b-form-group>
          </b-form>
        </b-modal>
      </b-col>
    </b-row>
    <Transition name="list" tag="div" class="row" mode="out-in">
      <b-spinner style="margin: 15px; width: 3rem; height: 3rem;" label="Spinning" v-if="searchUsers.length <= 0 && !afterResult"></b-spinner>
    </Transition>
    <TransitionGroup name="list" tag="div" class="row" mode="out-in">
      <UserComponent v-for="user of searchUsers" :key="user.id" :user="user"/>
    </TransitionGroup>
    <transition name="fade-no-content">
      <b-row class="my-5" v-if="searchUsers.length <= 0 && afterResult">
        <b-col>
          <h2 class="no-content">No se han encontrado usuarios</h2>
        </b-col>
      </b-row>
    </transition>
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
      afterResult: false,
      txtSearch: '',
      users: [] as User[],
      searchUsers: [] as User[],
      pwdState: null,
      pwdState2: null as boolean | null,
      usernameState: null,
      roleState: null,
      pwd_check: '',
      options: [
        { value: null, text: 'Seleccione un rol' },
        { value: 1, text: 'Administrador' },
        { value: 2, text: 'Supervisor' },
      ],
      newUser: {
        username: '',
        pwd: '',
        role: null,
      },
    }
  },
  created() {
    emitter.emit('check-routes');
    this.getAll();
  },
  mounted() {
    emitter.on('user-getAll', this.getAll);
  },
  methods: {
    checkFormValidity() {
      const form: any = this.$refs['addUser'];
      this.usernameState = form.username.checkValidity()
      this.pwdState = form.pwd.checkValidity()
      this.roleState = form.role.checkValidity()
      this.pwdState2 = this.newUser.pwd !== '' && this.newUser.pwd === this.pwd_check && form.pwd_2.checkValidity()
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
      this.pwdState = null;
      this.pwdState2 = null as boolean | null;
      this.usernameState = null;
      this.roleState = null;
      this.pwd_check = '';
      this.newUser = {
        pwd: '',
        username: '',
        role: null
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
      }).finally(() =>{
        this.afterResult = true
      })
    },
    addUser() {
      if (!this.checkFormValidity()) {
        return
      }

      const title = 'Agregar Nuevo Usuario';
      let toastArgs = {};
      this.axios.post('user', this.newUser).then(response => {
        emitter.emit('user-getAll');
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
            case 434:
              toastArgs = {
                title: title,
                description: 'El usuario no está registrado',
                type: 'error'
              }
              break;
            case 437:
              toastArgs = {
                title: title,
                description: 'El usuario ya fue agreagado anteriormente',
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
        } else {
          emitter.emit('show-toast', {
            title: title,
            description: 'Ha surgido un error inesperado',
            type: 'error'
          });

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

.fade-no-content-enter-active {
  transition: opacity 0.4s;
}

.fade-no-content-leave-active {
  transition: opacity 0.1s;
}

.fade-no-content-enter,
.fade-no-content-leave-to {
  opacity: 0;
}

.form-control.search-bar {
  border-radius: 100rem;

  &:focus {
    border-color: #a1fe86;
    box-shadow: 0 0 0 0.25rem #46fd0d40;
  }
}
</style>


