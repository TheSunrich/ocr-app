<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" class="nav-title">
        <a class="btn-return" @click="returnToBranch"
           v-if="$route.name === 'BranchFolder' && $store.state.user.role === 1">
          <font-awesome-icon icon="fa-solid fa-close" size="xl"/>
        </a>
        <h1 v-if="$route.name === 'Folder'">Carpetas</h1>
        <h1 v-else-if="$route.name === 'BranchFolder'">Carpetas de la sucursal: {{ branch.name }}</h1>
      </b-col>
    </b-row>
    <b-row class="mb-4 mt-2">
      <b-col cols="6">
        <b-form-input v-model="txtSearch" placeholder="Búsqueda" type="search"></b-form-input>
      </b-col>
      <b-col cols="2">
        <b-form-datepicker v-model="txtDateInit" :max="txtDateEnd || new Date()"
                           :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                           locale="en" reset-button close-button/>
      </b-col>
      <b-col cols="2">
        <b-form-datepicker v-model="txtDateEnd" :min="txtDateInit" :max="new Date()"
                           :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                           locale="en" reset-button close-button/>
      </b-col>
      <b-col cols="1" class="d-flex align-content-center justify-content-center">
        <b-button block variant="primary" pill @click="search">
          <font-awesome-icon icon="fa-solid fa-search"/>
        </b-button>
      </b-col>
      <b-col cols="1" class="d-flex align-content-center justify-content-center">
        <b-button block :pressed.sync="checked" variant="primary" pill>
          <font-awesome-icon icon="fa-solid fa-link"/>
        </b-button>
      </b-col>
    </b-row>
    <Transition name="list" tag="div" class="row" mode="out-in">
      <b-spinner style="margin: 15px; width: 3rem; height: 3rem;" label="Spinning"
                 v-if="searchFolders.length <= 0 && !afterResult"></b-spinner>
    </Transition>
    <TransitionGroup name="list" tag="div" class="row" mode="out-in">
      <FolderComponent v-for="folder in searchFolders" :key="folder.name" :date-init="txtDateInit"
                       :date-end="txtDateEnd"
                       :folder="folder"/>
    </TransitionGroup>
    <transition name="fade-no-content">
      <b-row class="my-5" v-if="searchFolders.length <= 0 && afterResult">
        <b-col>
          <h2 class="no-content">No se han encontrado carpetas</h2>
        </b-col>
      </b-row>
    </transition>
  </b-container>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import FolderComponent from '@/components/Folder/Folder.vue';
import Branch from "@/models/branch";
import {emitter} from "@/main";
import Folder from "@/models/folder";
import folder from "@/components/Folder/Folder.vue";

export default defineComponent({
  name: "Folder",
  props: {
    branch: {type: Branch, default: undefined},
    dateInit: {type: String, default: ''},
    dateEnd: {type: String, default: ''},
  },
  components: {
    FolderComponent
  },
  data() {
    return {
      afterResult: false,
      txtSearch: '',
      txtDateInit: this.dateInit,
      txtDateEnd: this.dateEnd,
      folders: [] as Folder[],
      searchFolders: [] as Folder[],
      userBranch: {} as Branch
    }
  },
  created() {
    emitter.emit('check-routes');
  },
  mounted() {
    console.log(this.$route.name)
    if (this.$route.name === 'Folder') {
      this.getAll();
      emitter.on('folder-getList', this.getAll);
    } else if (this.$route.name === 'BranchFolder') {
      if (this.branch === undefined) {
        this.$router.replace({name: 'Branch'});
      }
      this.getFromBranch();
      emitter.on('folder-getList', this.getFromBranch);
    } else if (this.$route.name === 'UserFolder') {
      if (this.$store.state.user.idClient !== null) {
        this.getFromCompany()
        emitter.on('folder-getList', this.getFromCompany);
      } else {
        this.userBranch = this.$store.state.user.branch;
        this.getAll();
        emitter.on('folder-getList', this.getAll);
      }
    }
  },
  computed: {
    checked: {
      get(): boolean {
        return this.$store.state.isShareActive;
      },
      set(newValue: boolean) {
        this.$store.commit('emptyShareList');
        this.$store.commit('toggleShareActive');
      }
    },
    branchInfo(): Branch | undefined {
      if (this.$route.name === 'BranchFolder') {
        return this.branch;
      } else if (this.$route.name === 'UserFolder') {
        return this.userBranch;
      }
      return undefined;
    }
  },
  methods: {
    stringToDate(_date: string, _format: string, _delimiter: string) {
      let formatLowerCase = _format.toLowerCase();
      let formatItems = formatLowerCase.split(_delimiter);
      let dateItems = _date.split(_delimiter);
      let monthIndex = formatItems.indexOf("mm");
      let dayIndex = formatItems.indexOf("dd");
      let yearIndex = formatItems.indexOf("yyyy");
      let month = parseInt(dateItems[monthIndex]);
      month -= 1;
      let formatedDate: any = Date.UTC(parseInt(dateItems[yearIndex]), month, parseInt(dateItems[dayIndex]));
      return formatedDate;
    },
    search() {
      let filteredFolders: Folder[] = [];
      if (this.txtSearch === '' && this.txtDateInit === '' && this.txtDateEnd === '') {
        this.searchFolders = this.folders;
        return;
      }
      this.folders.map(folder => {
        if (folder.name.toLowerCase().includes(this.txtSearch.toLowerCase())) {
          if (this.txtDateInit !== '' && this.txtDateEnd !== '') {
            if (this.stringToDate(folder.datetime, "yyyy-mm-dd", "-") >= this.stringToDate(this.txtDateInit, "yyyy-mm-dd", "-") && this.stringToDate(folder.datetime, "yyyy-mm-dd", "-") <= this.stringToDate(this.txtDateEnd, "yyyy-mm-dd", "-")) {
              filteredFolders.push(folder)
            }
          } else if (this.txtDateInit !== '') {
            if (this.stringToDate(folder.datetime, "yyyy-mm-dd", "-") >= this.stringToDate(this.txtDateInit, "yyyy-mm-dd", "-")) {
              filteredFolders.push(folder)
            }
          } else if (this.txtDateEnd !== '') {
            if (this.stringToDate(folder.datetime, "yyyy-mm-dd", "-") <= this.stringToDate(this.txtDateEnd, "yyyy-mm-dd", "-")) {
              filteredFolders.push(folder)
            }
          } else {
            filteredFolders.push(folder)
          }
        }
      })
      this.searchFolders = filteredFolders
    },
    getAll() {
      this.axios.get('folder').then(response => {
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
        this.folders = response.data;
        this.searchFolders = response.data;
      }).catch(error => {
        console.log(error);
      }).finally(() => {
        this.afterResult = true;
      });
    },
    getFromBranch() {
      let branch: Branch | undefined = this.branchInfo;
      if (branch === undefined) {
        emitter.emit('show-toast', {
          title: 'Lista de carpetas',
          description: 'Ha habido un error al cargar las carpetas',
          type: 'error'
        });
        return;
      }
      this.axios.get(`folder/${branch.id}/branch`).then(response => {
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
        this.folders = response.data;
        this.searchFolders = response.data;
      }).catch(error => {
        console.log(error);
      }).finally(() => {
        this.afterResult = true;
      })
    },
    getFromCompany() {
      if (this.$store.state.user.client === undefined) {
        emitter.emit('show-toast', {
          title: 'Lista de carpetas',
          description: 'Ha habido un error al cargar las carpetas',
          type: 'error'
        });
        return;
      }
      this.axios.get(`folder/${this.$store.state.user.client.idCompany}/company`).then(response => {
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
        this.folders = response.data;
        this.searchFolders = response.data;
      }).catch(error => {
        console.log(error);
      }).finally(() => {
        this.afterResult = true;
      })
    },
    returnToBranch() {
      this.$router.push({name: 'Branch', replace: true})
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