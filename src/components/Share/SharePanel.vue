<template>
  <div class="share-sidebar container-fluid" :style="{ width:getShareWidth }"
       :class="{'share-expanded': !isShareCollapsed}">
    <TransitionGroup name="list" tag="div" class="row no-gutters share-list" mode="out-in">
      <b-col cols="12" class="py-2" v-for="folder in folderList" :key="folder.name">
        <b-card>
          <b-card-body class="row p-0">
            <b-col cols="2">
              <font-awesome-icon icon="fa-solid fa-folder" size="sm"/>
            </b-col>
            <b-col cols="10" class="folder-name">{{ folder.name }}</b-col>
          </b-card-body>
        </b-card>
      </b-col>
    </TransitionGroup>
    <b-row class="share-form px-3">
      <!--<b-col cols="12" class="d-flex align-items-center">
        <b-form-checkbox id="isPwd" v-model="isPwd" name="isPwd" class="d-inline-block"/>
        <b-form-input v-model="pwd" placeholder="Contraseña" class="d-inline-block" :disabled="!isPwd"></b-form-input>
      </b-col>
      <b-col cols="12" class="d-flex align-items-center">
        <b-form-checkbox id="isDate" v-model="isDate" name="isDate"/>
        <b-form-datepicker v-model="date" class="text-left"
                           :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                           :disabled="!isDate" placeholder="Vencimiento" style="user-select: none"/>
      </b-col>-->
      <b-col cols="12">
        <b-button class="mt-2" @click="shareFolders" variant="primary" block pill :disabled="folderList.length <= 0">Compartir</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import Folder from "@/models/folder";
import {defineComponent} from "vue";
import {emitter} from "@/main";
import {types} from "sass";
import List = types.List;

const SHARE_WIDTH = 275;
const SHARE_WIDTH_COLLAPSED = 0;

export default defineComponent({
  name: "SharePanel",
  props: {},
  data() {
    return {
      isPwd: false,
      isDate: false,
      pwd: '',
      date: '',
    }
  },
  computed: {
    isShareCollapsed(): boolean {
      return !this.$store.state.isShareActive;
    },
    getShareWidth(): string {
      return `${this.isShareCollapsed ? SHARE_WIDTH_COLLAPSED : SHARE_WIDTH}px`;
    },
    folderList(): Folder[] {
      return this.$store.state.shareList;
    }
  },
  methods: {
    shareFolders(): void {
      const title = 'Compartir carpetas';
      let toastArgs = {};
      let folders: Object[] = []
      this.folderList.map(folder => {
        folders.push({
          name: folder.name,
          idBranch: folder.idBranch
        })
      })
      let data:any = {
        idUser: this.$store.state.user.id,
        folders: folders
      }
      if(this.isPwd){
        data['pwd'] = this.pwd
      }
      if(this.isDate){
        data['dateEnd'] = this.date
      }
      if(folders.length <= 0){
        toastArgs = {
          title: title,
          description: 'No se han elegido carpetas para compartir',
          type: 'warning'
        }
        emitter.emit('show-toast', toastArgs);
        return;
      }
      this.axios.post('shared', data).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'Las carpetas han sido compartidas correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        this.shareFoldersModal(response.data.data.id)
        this.$store.commit('emptyShareList');
        this.$store.commit('toggleShareActive');
      })
    },
    shareFoldersModal(code: string) {
      this.$bvModal.msgBoxOk(`Las carpetas han sido compartidas correctamente, se ha generado un link: http://192.168.100.60:8080/shared/${code}`, {
        title: 'Compartir Carpetas',
        buttonSize: 'sm',
        okVariant: 'success',
        headerClass: 'p-2 border-bottom-0',
        footerClass: 'p-2 border-top-0',
        centered: true
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
  transform: translateX(200%);
}

.folder-name{
  user-select: none;
}

.share-sidebar {
  padding: 0;
  display: flex;
  float: right;
  position: fixed;
  background-color: white;
  z-index: 2;
  top: 0;
  right: 0;
  bottom: 0;

  transition: width 0.5s ease-in-out, opacity ease-in-out 0.5s;

  flex-direction: column;

  &.share-expanded {
    opacity: 100%;
  }

  &:not(.share-expanded) {
    opacity: 0;
  }

  .share-list {
    display: block;
    overflow: auto;
    margin-bottom: 60px;
    height: 100%;
    padding: 10px 15px;
  }

  .share-form {
    position: fixed;
    bottom: 0;
    right: 0;
    height: 60px;
    width: 275px;
    margin: 0;
  }
}

::placeholder {
  user-select: none;
}

</style>

