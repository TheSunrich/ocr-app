<template>
  <b-container fluid class="vh-100" id="login">
    <b-form class="login-card" ref="loginForm" @submit.stop.prevent="userLogin">
      <b-card>
        <img src="../assets/img/logo.png" alt="logo" width="150"/>
        <h1>Inicio de Sesión</h1>
        <b-row class="text-left">
          <b-col cols="12">
            <b-form-group
                label-for="username"
                :state="usernameState">
              <label for="username" class="form-label ml-2">Usuario</label>
              <b-form-input id="username" name="username" v-model.trim="username" type="text" :state="usernameState"
                            required/>
              <b-form-invalid-feedback>
                El campo del nombre de usuario es requerido
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group
                label-for="pwd"
                :state="pwdState">
              <label for="pwd" class="form-label ml-2">Contraseña</label>
              <b-form-input id="pwd" name="pwd" v-model.trim="pwd" type="password" :state="pwdState" required/>
              <b-form-invalid-feedback>
                El campo de la contraseña es requerido
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-button block pill variant="primary" @click="userLogin">Iniciar Sesión</b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import {emitter} from "@/main";
import {defineComponent} from "vue";

export default defineComponent({
  name: "Login",
  data() {
    return {
      username: '',
      pwd: '',
      usernameState: null,
      pwdState: null,
    }
  },
  created() {
    emitter.emit('check-routes');
  },
  mounted() {
    if (this.$store.state.user && this.$store.state.token) {
      if (this.$store.state.user.role === 1) {
        this.$router.push('/branch');
      } else {
        this.$router.push('/folder');
      }
    }
  },
  methods: {
    checkFormValidity: function () {
      const form: any = this.$refs.loginForm;
      this.usernameState = form.username.checkValidity();
      this.pwdState = form.pwd.checkValidity();
      return form.checkValidity();
    },
    userLogin() {
      if (!this.checkFormValidity()) {
        return
      }

      this.axios.post('login', {username: this.username, pwd: this.pwd}).then(response => {
        emitter.emit('show-toast', {
          title: 'Inicio de Sesión',
          description: 'El usuario ha iniciado sesión correctamente',
          type: 'success'
        });
        this.$store.commit('setToken', response.data.info.token);
        this.$store.commit('setUser', response.data.info.user);
        if (this.$store.state.user.role === 1) {
          this.$router.push('/branch');
        } else if (this.$store.state.user.role === 2) {
          this.$router.push('/folder');
        }
      }).catch(error => {
        console.log(error)
        if (error.response.data.error.code === 402 || error.response.data.error.code === 401) {
          emitter.emit('show-toast', {
            title: 'Inicio de Sesión',
            description: 'Nombre de usuario o contraseña incorrectas',
            type: 'error'
          });
        } else {
          emitter.emit('show-toast', {
            title: 'Inicio de Sesión',
            description: 'Error al iniciar sesión',
            type: 'error'
          });
        }
      })
    }
  }
})
</script>

<style scoped lang="scss">
#login {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  display: block;
  width: 40%;
  min-width: 400px;

  .card-body {
    padding-left: 35px;
    padding-right: 35px;

    h1 {
      margin: 15px 0 5px;
    }

    .col-12 {
      margin-top: 15px;
      margin-bottom: 5px;
    }
  }
}
</style>