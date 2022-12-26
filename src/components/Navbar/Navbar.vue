<template>
  <b-container fluid class="p-3">
    <b-row no-gutters>
      <b-col cols="11" class="text-start">
        <h1 class="welcome-text">Bienvenido <span>Usuario Invitado</span></h1>
      </b-col>
      <b-col cols="1" class="text-end">
        <b-avatar id="avatar" class="align-self-end"
                  src="https://imgs.search.brave.com/dYn-zSgL-mtE1bBgenFqiV0z7SDI0C6ImyShLDatM-4/rs:fit:900:900:1/g:ce/aHR0cHM6Ly95dDMu/Z2dwaHQuY29tL2Ev/QUFUWEFKd3hPQ1Ut/bTBBQkNnakc5VmNf/ME5TbE10VnU1LVJR/TEs0N093PXM5MDAt/Yy1rLWMweGZmZmZm/ZmZmLW5vLXJqLW1v"></b-avatar>
        <b-popover target="avatar" triggers="click" placement="bottom">
          <div class="text-center">
            <img class="user-img"
                 src="https://imgs.search.brave.com/dYn-zSgL-mtE1bBgenFqiV0z7SDI0C6ImyShLDatM-4/rs:fit:900:900:1/g:ce/aHR0cHM6Ly95dDMu/Z2dwaHQuY29tL2Ev/QUFUWEFKd3hPQ1Ut/bTBBQkNnakc5VmNf/ME5TbE10VnU1LVJR/TEs0N093PXM5MDAt/Yy1rLWMweGZmZmZm/ZmZmLW5vLXJqLW1v"
                 alt="user">
            <br/>
            <br/>
            {{ $store.state.user.name }}<br>{{ $store.state.user.email }}
            <br/>
            <b-button variant="outline-danger" style="border: none; margin-top: 10px" @click="logout">
              <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket"/>&nbsp; Cerrar sesión
            </b-button>
          </div>
        </b-popover>
      </b-col>
    </b-row>
    <b-overlay :show="overlay" no-wrap variant="dark" opacity="0.39" blur="blur" rounded="lg"/>
  </b-container>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {emitter} from "@/main";

export default defineComponent({
  name: "Navbar",
  data() {
    return {
      overlay: false,
    }
  },
  methods: {
    logout(){
      this.$store.commit('setUser', false);
      this.$store.commit('setToken', false);
      this.$router.push('/login');
      emitter.emit('show-toast', {
        title: 'Cierre de sesión',
        description: 'El usuario ha cerrado sesión correctamente',
        type: 'success'
      });
    }
  }
})
</script>

<style lang="scss">

.welcome-text {
  font-family: "Manrope", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 28px;
  line-height: 38px;
  color: #8D8D8D;
  margin-bottom: 10px;
  margin-left: 10px;

  span {
    color: black;
    font-weight: bold;
  }
}

.user-menu {
  width: 35px;
  margin-right: 10px;
  margin-top: 8px;
}

.user-img {
  border-radius: 1000px;
  width: 120px;
  margin: 15px 15px 0 15px;
}

</style>