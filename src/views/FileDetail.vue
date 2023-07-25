<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" class="nav-title">
        <a class="btn-return" @click="returnToFileList">
          <font-awesome-icon icon="fa-solid fa-close" size="xl"/>
        </a>
        <h1>Detalle de archivo</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6" lg="7" class="p-3 pdf-container" order="2" order-md="1">
        <b-row class="pdf-viewer shadow">
          <b-col cols="12" class="mb-2">
            <b-button-group>
              <b-button @click="scaleDecrement" :disabled="scale <= 1">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass-minus"/>
              </b-button>
              <b-button @click="scaleIncrement" :disabled="scale >= 15">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass-plus"/>
              </b-button>
              <b-button @click="setPrevious" :disabled="file.previous === null">
                <font-awesome-icon icon="fa-solid fa-arrow-left"/>
              </b-button>
              <b-button @click="setNext" :disabled="file.next === null">
                <font-awesome-icon icon="fa-solid fa-arrow-right"/>
              </b-button>
              <b-button variant="dark-green" @click="downloadFile">Descargar</b-button>
            </b-button-group>
          </b-col>
          <b-col cols="12">
            <div class="img_viewer">
              <b-img :src="src" :class="`img_detail ${scaleClass}`"/>
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col md="6" lg="5" class="p-3" order="1" order-md="2">
        <b-form @submit.stop.prevent="update" class="pdf-data shadow text-start pt-4 pb-4 px-3">
          <b-row class="px-3">
            <b-col cols="12">
              <h3>Nombre: </h3>
              <b-input-group append=".pdf">
                <b-form-input v-model.trim="file.title" type="text" required
                              :readonly="$store.state.user.idClient === null"/>
              </b-input-group>
              <br/>
            </b-col>
            <b-col cols="12">
              <h3>Código: </h3>
              <b-form-input v-model.trim="file.code" type="text" required
                            :readonly="$store.state.user.idClient === null"/>
              <br/>
            </b-col>
            <b-col cols="12">
              <h3>Fecha de Creación: </h3>
              <b-form-input v-model.trim="file.creation_date" type="text" readonly/>
              <br/>
            </b-col>
            <b-col cols="12" v-if="$store.state.user.idClient === null">
              <b-button variant="primary" block type="submit">
                Actualizar información
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed';
import {emitter} from "@/main";
import Branch from "@/models/branch";

export default defineComponent({
  name: 'FileDetail',
  components: {
    VuePdfEmbed,
  },
  props: {
    branch: {type: Branch, required: true},
    code: {type: String, required: true},
    file_name: {type: String, required: true},
    preRoute: {type: String, required: true},
    dateInit: {type: String, default: ''},
    dateEnd: {type: String, default: ''},
  },
  data() {
    return {
      oldFile: {
        title: '',
        code: '',
        creation_date: '',
        next: '',
        previous: '',
      },
      file: {
        title: '',
        code: '',
        creation_date: '',
        next: '',
        previous: '',
      },
      src: '',
      scale: 1
    }
  },
  computed: {
    scaleClass(): String {
      return `scale-${this.scale}`
    }
  },
  created() {
    emitter.emit('check-routes');
  },
  mounted() {
    if (this.branch === undefined || this.code === undefined || this.file_name === undefined) {
      this.$router.push({name: 'Folder', replace: true})
    }
    this.getData();
  },
  methods: {
    scaleIncrement() {
      this.scale++;
      if (this.scale >= 15) {
        this.scale = 15
      }
    },
    scaleDecrement() {
      this.scale--;
      if (this.scale <= 1) {
        this.scale = 1
      }
    },
    setNext() {
      let title = 'Obtención de datos del archivo'
      let toastArgs = {};
      this.axios.get(`file/${this.branch.name}/${this.file.code}/${this.file.next}`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'Los datos del archivo han sido obtenidos correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        this.file = response.data.info.data;
        this.oldFile = {...this.file};
        this.src = this.axios.defaults.baseURL + `files/${this.branch.name}/${this.file.code}/${this.file.title}.png`
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 404:
              toastArgs = {
                title: title,
                description: 'No se ha encontrado el archivo',
                type: 'warning'
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
      })
    },
    setPrevious() {
      let title = 'Obtención de datos del archivo'
      let toastArgs = {};
      this.axios.get(`file/${this.branch.name}/${this.file.code}/${this.file.previous}`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'Los datos del archivo han sido obtenidos correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        this.file = response.data.info.data;
        this.oldFile = {...this.file};
        this.src = this.axios.defaults.baseURL + `files/${this.branch.name}/${this.file.code}/${this.file.title}.png`
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 404:
              toastArgs = {
                title: title,
                description: 'No se ha encontrado el archivo',
                type: 'warning'
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
      })
    },
    getData() {
      let title = 'Obtención de datos del archivo'
      let toastArgs = {};
      this.axios.get(`file/${this.branch.name}/${this.code}/${this.file_name}`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'Los datos del archivo han sido obtenidos correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        this.file = response.data.info.data;
        this.oldFile = {...this.file};
        this.src = this.axios.defaults.baseURL + `files/${this.branch.name}/${this.file.code}/${this.file.title}.png`
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 404:
              toastArgs = {
                title: title,
                description: 'No se ha encontrado el archivo',
                type: 'warning'
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
      })
    },
    downloadFile() {
      this.axios.get(`file/${this.branch.name}/${this.file.code}/${this.file.title}.png?is_pdf=true`, {
        responseType: 'blob'
      }).then(res => {
        let FILE = window.URL.createObjectURL(new Blob([res.data]));

        let docUrl = document.createElement('a');
        docUrl.href = FILE;
        docUrl.setAttribute('download', this.file.title + '.pdf');
        document.body.appendChild(docUrl);
        docUrl.click();
      });
    },
    update() {
      let title = 'Actualización de datos del archivo'
      if (this.file.title.trim() === '') {
        emitter.emit('show-toast', {
          title: title,
          description: 'El archivo debe tener un nombre',
          type: 'error'
        });
        this.file.title = this.oldFile.title
        return;
      }
      if (this.oldFile.title === this.file.title) {
        emitter.emit('show-toast', {
          title: title,
          description: 'Los datos del archivo son iguales',
          type: 'warning'
        });
        return;
      }
      let new_data: any = {
        new_file_name: this.file.title
      }
      if (this.file.code !== this.oldFile.code) {
        new_data.new_code = this.file.code
      }
      let toastArgs = {};
      this.axios.patch(`file/${this.branch.name}/${this.code}/${this.oldFile.title}.png`, new_data).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'Los datos del archivo han sido modificados correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        this.oldFile.title = new_data.new_file_name
        if (new_data.hasOwnProperty('new_code')) {
          this.oldFile.code = new_data.new_code
        }
        this.src = this.axios.defaults.baseURL + `files/${this.branch.name}/${this.file.code}/${this.file.title}.png`
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 404:
              toastArgs = {
                title: title,
                description: 'No se ha encontrado el archivo',
                type: 'warning'
              }
              break;
            case 410:
              toastArgs = {
                title: title,
                description: 'El archivo no se ha podido modificar',
                type: 'warning'
              }
              break;
            case 419:
              toastArgs = {
                title: title,
                description: 'No se ha encontrado el folder del archivo',
                type: 'warning'
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
      })
    },
    returnToFileList() {
      this.$router.replace({
        name: 'FolderFiles',
        params: {
          branch: JSON.stringify(this.branch),
          folder: this.file.code,
          preRoute: this.preRoute,
          dateInit: this.dateInit,
          dateEnd: this.dateEnd
        }
      });
    }
  }
})
</script>

<style lang="scss">
@use "sass:math";

@function calc_translate($i) {
  @return math.percentage(((12.5 * $i - 12.5)/100)+1);
}

@function calc_scale($i) {
  @return ($i + 3)/4;
}

.pdf-container {
  padding-left: 32px !important;
  padding-right: 32px !important;

  .pdf-viewer {
    padding: 15px;
    border-radius: 15px;
    background-color: white;
    min-height: 396px;
    max-height: 960px;

    .img_viewer {
      height: 100%;
      width: 100%;
      max-height: 882px;
      max-width: 682px;
      overflow: auto;
    }
  }
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

div {
  .img_detail {
    height: 100% !important;
    width: 100% !important;
    transition: transform ease-in-out 0.5s, height ease-in-out 0.5s, width ease-in-out 0.5s;


    @for $i from 1 through 15 {
      &.scale-#{$i} {
        //transform: translate(calc_translate($i), calc_translate($i)) scale(calc_scale($i));
        height: calc_translate($i) !important;
        width: calc_translate($i) !important;
      }
    }
  }
}

.pdf-data {
  padding: 15px;
  border-radius: 15px;
  background-color: white;
}
</style>