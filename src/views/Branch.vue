<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12">
        <h1>Sucursales</h1>
      </b-col>
    </b-row>
    <b-row class="mb-4 mt-2">
      <b-col cols="12">
        <b-form-input class="search-bar" v-model="txtSearch" placeholder="Búsqueda" type="search" size="lg"
                      @update="search"></b-form-input>
      </b-col>
    </b-row>
    <TransitionGroup name="list" tag="div" class="row" mode="out-in">
      <BranchComponent v-for="branch of searchBranches" :key="branch.id" :branch="branch"/>
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
      txtSearch: '',
      branches: [] as Branch[],
      searchBranches: [] as Branch[],
      nameState: null,
      cityState: null,
      stateState: null,
      newBranch: {
        name: '',
        city: '',
        state: '',
      }
    }
  },
  created() {
    emitter.emit('check-routes');
    this.getAll();
  },
  mounted() {
    this.$store.commit('setShareActive', false);
    emitter.on('branch-getAll', this.getAll);
  },
  methods: {
    checkFormValidity: function () {
      const form: any = this.$refs.addForm;
      this.nameState = form.name.checkValidity();
      this.cityState = form.city.checkValidity()
      this.stateState = form.state.checkValidity()
      return form.checkValidity();
    },
    handleOk(bvModalEvent: any) {
      bvModalEvent.preventDefault()
      this.addBranch()
    },
    search() {
      let filteredBranches: Branch[] = [];
      if (this.txtSearch == '') {
        this.searchBranches = this.branches;
        return;
      }
      this.branches.map(branch => {
        if (branch.name.toLowerCase().includes(this.txtSearch.toLowerCase())) {
          filteredBranches.push(branch)
        }
      })
      this.searchBranches = filteredBranches
    },
    getAll() {
      this.axios.get('branch').then(response => {
        if (response.data.hasOwnProperty('error')) {
          if (response.data.error.code === 440) {
            emitter.emit('show-toast', {
              title: 'Lista de sucursales',
              description: 'No se han encontrado sucursales',
              type: 'warning'
            });
          }
          return;
        }
        this.branches = response.data;
        this.searchBranches = response.data;
      }).catch(error => {
        console.log(error);
      })
    },
    emptyForm() {
      this.nameState = null;
      this.cityState = null;
      this.stateState = null;
      this.newBranch = {
        name: '',
        city: '',
        state: '',
      }
    },
    addBranch() {
      if (!this.checkFormValidity()) {
        return
      }

      const title = 'Agregar Nueva Sucursal';
      let toastArgs = {};
      this.axios.post(`branch`, this.newBranch).then(response => {
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
            description: 'La sucursal se ha agregado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('branch-getAll');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 430:
              toastArgs = {
                title: title,
                description: 'La sucursal no ha podido ser agregada',
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
        this.$bvModal.hide('addBranch');
      })
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

.form-control.search-bar {
  border-radius: 100rem;

  &:focus {
    border-color: #a1fe86;
    box-shadow: 0 0 0 0.25rem #46fd0d40;
  }
}

</style>