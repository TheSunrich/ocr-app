<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" class="nav-title mt-3">
        <a class="btn-return" @click="returnToFolder()">
          <font-awesome-icon icon="fa-solid fa-close" size="xl" />
        </a>
        <h1>Archivos de: {{ folder }}</h1>
      </b-col>
    </b-row>
    <b-row class="mb-4 mt-2">
      <b-col cols="12">
        <b-form-input v-model="txtSearch" placeholder="Búsqueda" type="search" size="lg"
                      @update="search"></b-form-input>
      </b-col>
    </b-row>
    <TransitionGroup name="list" tag="div" class="row" mode="out-in">
      <SharedFileComponent v-for="file in searchFiles" :key="file" :file="file" :branch="branch" :share-code="shared_code"
                           :folder="folder" />
    </TransitionGroup>
  </b-container>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {emitter} from "@/main";
import SharedFileComponent from "@/components/Share/SharedFile.vue";
import Branch from "@/models/branch";

export default defineComponent({
  name: "SharedFolder",
  props: {
    shared_code: {type: String, required: true},
    folder: {type: String, required: true},
    branchId: {type: Number, required: true}
  },
  components: {
    SharedFileComponent
  },
  data() {
    return {
      txtSearch: '',
      branch: {} as Branch,
      files: [] as String[],
      searchFiles: [] as String[]
    }
  },
  created() {
    emitter.emit('check-routes');
  },
  mounted() {
    this.getOne();
  },
  methods: {
    search() {
      let filteredFiles: String[] = [];
      if (this.txtSearch == '') {
        this.searchFiles = this.files;
        return;
      }
      this.files.map(file => {
        if (file.toLowerCase().includes(this.txtSearch.toLowerCase())) {
          filteredFiles.push(file)
        }
      })
      this.searchFiles = filteredFiles
    },
    getOne() {
      this.axios.get(`folder/${this.branchId}/${this.folder}`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          if (response.data.error.code == 404) {
            emitter.emit('show-toast', {
              title: 'Lista de archivos',
              description: 'No se han encontrado carpetas',
              type: 'warning'
            });
          }
          return;
        }
        this.branch = response.data.branch;
        this.files = response.data.files.active;
        this.searchFiles = response.data.files.active;
      }).catch(error => {
        console.log(error);
      })
    },
    returnToFolder() {
      const id = this.shared_code;
      this.$router.push({ name: 'SharedFolders', params: { id }, replace: true});
    },
  },
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

.nav-title {
  position: relative;

  .btn-return {
    display: flex;
    position: absolute;
    width: 36px;
    height: 36px;
    top: 0;
    right: 15px;
    background-color: white;
    color: #2c3e50;
    border-radius: 100rem;
    justify-content: center;
    align-items: center;

    transition: background-color ease-in-out 0.15s, color ease-in-out 0.15s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.15);
    }

    &:active {
      background-color: rgba(0, 0, 0, 0.25);
    }
  }
}

.form-control {
  border-radius: 100rem;

  &:focus {
    border-color: #a1fe86;
    box-shadow: 0 0 0 0.25rem #46fd0d40;
  }
}
</style>