<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" class="nav-title mt-3">
        <h1>Carpetas Compartidas</h1>
      </b-col>
    </b-row>
    <b-row class="mb-4 mt-2">
      <b-col cols="12">
        <b-form-input v-model="txtSearch" placeholder="Búsqueda" type="search" size="lg"
                      @update="search"></b-form-input>
      </b-col>
    </b-row>
    <TransitionGroup name="list" tag="div" class="row" mode="out-in">
      <SharedFolderComponent v-for="folder in searchFolders" :key="folder.name" :branch-id="shared_info.user.idBranch"
                             :share-code="$route.params.id" :folder="folder" />
    </TransitionGroup>
    <transition name="fade-no-content">
      <b-row class="my-5" v-if="searchFolders.length <= 0">
        <b-col>
          <h2 class="no-content">No se han encontrado carpetas</h2>
        </b-col>
      </b-row>
    </transition>
  </b-container>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SharedFolderComponent from '@/components/Share/SharedFolder.vue';
import {emitter} from "@/main";
import Folder from "@/models/folder";
import Share from "@/models/share";

export default defineComponent({
  name: "Shared",
  components: {
    SharedFolderComponent
  },
  data() {
    return {
      txtSearch: '',
      shared_info: {} as Share,
      searchFolders: [] as Folder[],
    }
  },
  created() {
    emitter.emit('check-routes');
  },
  mounted() {
    this.getShared()
  },
  methods: {
    search() {
      let filteredFolders: Folder[] = [];
      if (this.txtSearch == '') {
        this.searchFolders = this.shared_info.folders;
        return;
      }
      this.shared_info.folders.map(folder => {
        if (folder.name.toLowerCase().includes(this.txtSearch.toLowerCase())) {
          filteredFolders.push(folder)
        }
      })
      this.searchFolders = filteredFolders
    },
    getShared() {
      this.axios.get(`shared/${this.$route.params.id}`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          if (response.data.error.code == 440) {
            emitter.emit('show-toast', {
              title: 'Lista de carpetas',
              description: 'No se han encontrado carpetas',
              type: 'warning'
            });
          }
          return;
        }
        this.shared_info = response.data;
        this.searchFolders = response.data.folders;
      }).catch(error => {
        console.log(error);
      })
    },
  }
})
</script>

<style scoped lang="scss">

/*input[type='search']::-webkit-search-cancel-button{
  -webkit-appearance: listitem;
  background: red;
}*/


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

.no-content {
  color: #d0d7d0;
}
</style>