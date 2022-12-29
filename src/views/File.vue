<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" class="nav-title">
        <a class="btn-return" @click="isDeleted ? showActives() : returnToFolder()">
          <font-awesome-icon icon="fa-solid fa-close" size="xl"/>
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
      <FolderComponent :folder="folderFile" :deleted="true" v-if="!isDeleted" :key="folder"/>
      <FileComponent v-for="file in searchFiles" :key="file" :file="file" :branch="branch" :folder="folder"
                     :pre-route="preRoute" :isDeleted="isDeleted"/>
    </TransitionGroup>
  </b-container>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import FileComponent from '@/components/File/File.vue';
import {emitter} from "@/main";
import FolderComponent from "@/components/Folder/Folder.vue";
import Folder from "@/models/folder";
import Branch from "@/models/branch";

export default defineComponent({
  name: "File",
  props: {
    branch: {type: Branch, required: true},
    folder: {type: String, required: true},
    deleted: {type: Boolean, default: false},
    preRoute: {type: String, required: true}
  },
  components: {
    FolderComponent,
    FileComponent
  },
  data() {
    return {
      txtSearch: '',
      isDeleted: this.deleted,
      files: [] as String[],
      searchFiles: [] as String[]
    }
  },
  created() {
    emitter.emit('check-routes');
  },
  mounted() {
    if(this.branch === undefined || this.folder === undefined){
      this.$router.push({name: 'Folder', replace: true})
    }
    this.$store.commit('setShareActive', false);
    this.getAll(this.isDeleted);
    emitter.on('file-getList', (args: any) => {
      this.getAll(args.deleted);
      this.isDeleted = args.deleted;
    });
  },
  computed: {
    folderFile(): Folder {
      return new Folder({name: 'Eliminado', status: 1, branch: this.branch})
    }
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
    getAll(deleted: Boolean) {
      this.axios.get(`file/${this.branch.name}/${this.folder}`).then(response => {
        console.log(response.data)
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
        this.files = deleted ? response.data.deleted : response.data.active;
        this.searchFiles = deleted ? response.data.deleted : response.data.active;
      }).catch(error => {
        console.log(error);
        emitter.emit('show-toast', {
          title: 'Lista de archivos',
          description: 'Error al cargar los archivos',
          type: 'error'
        });
      })
    },
    showActives() {
      emitter.emit('file-getList', {deleted: false})
    },
    returnToFolder() {
      this.$router.push({name: this.preRoute, params: {branch: JSON.stringify(this.branch)}, replace: true})
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