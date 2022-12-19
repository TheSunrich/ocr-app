<template>
  <b-container fluid class="vh-100" id="login">
    <div class="login-card">
      <b-card>
        <img src="../assets/img/logo.png" alt="logo" width="150"/>
        <h1>Inicio de Sesión</h1>
        <b-row class="text-left">
          <b-col cols="12">
            <label for="username" class="form-label ml-2">Usuario</label>
            <input type="text" class="form-control" id="username" v-model="username">
          </b-col>
          <b-col cols="12">
            <label for="pwd" class="form-label ml-2">Contraseña</label>
            <input type="password" class="form-control" id="pwd" v-model="pwd">
          </b-col>
        </b-row>
      </b-card>
    </div>
  </b-container>
</template>

<script>
export default {
  name: "Login",
  data(){
    return{
      username: '',
      pwd: ''
    }
  },
  mounted:{},
  methods:{
    login(){
      
    }
  }
}
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