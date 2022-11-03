<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12">
        <h1>Sucursales</h1>
      </b-col>
    </b-row>
    <b-row class="mb-4 mt-2">
      <b-col cols="9">
        <b-form-input v-model="search" placeholder="Búsqueda" type="search" size="lg"></b-form-input>
      </b-col>
      <b-col cols="2" class="d-grid">
        <b-button block variant="primary" pill>Buscar</b-button>
      </b-col>
      <b-col cols="1" class="d-grid">
        <b-button block variant="primary" pill>
          <font-awesome-icon icon="fa-solid fa-plus"/>
        </b-button>
      </b-col>
    </b-row>
    <TransitionGroup name="list" tag="div" class="row" mode="out-in">
      <BranchComponent v-for="branch of branches" :key="branch.id" :branch="branch"/>
    </TransitionGroup>
  </b-container>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BranchComponent from "@/components/Branch/Branch.vue";
import {emitter} from "@/main";
import Branch from "@/models/branch";

export default defineComponent({
  name: "Branch",
  components: {
    BranchComponent
  },
  data() {
    return {
      search: '',
      branches: [] as Branch[],
    }
  },
  created() {
    this.getAll();
  },
  mounted() {
    emitter.on('branch-getAll', this.getAll);
  },
  methods: {
    getAll() {
      this.axios.get('branch').then(response => {
        if (response.data.hasOwnProperty('error')) {
          if (response.data.error.code == 440) {
            emitter.emit('show-toast', {
              title: 'Lista de sucursales',
              description: 'No se han encontrado sucursales',
              type: 'warning'
            });
          }
          return;
        }
        this.branches = response.data;
      }).catch(error => {
        console.log(error);
      })
    },
    add() {

    },
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

.form-control {
  border-radius: 100rem;

  &:focus {
    border-color: #a1fe86;
    box-shadow: 0 0 0 0.25rem #46fd0d40;
  }
}

</style>