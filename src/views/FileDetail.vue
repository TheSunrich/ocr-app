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
      <b-col md="6" lg="7" class="p-3" order="2" order-md="1">
        <b-row class="pdf-viewer shadow">
          <b-col cols="12" class="mb-2">
            <b-button-group>
              <b-button @click="scaleDecrement" :disabled="scale <= 1">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass-minus"/>
              </b-button>
              <b-button @click="scaleIncrement" :disabled="scale >= 15">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass-plus"/>
              </b-button>
              <b-button @click="downloadFile">Descargar</b-button>
            </b-button-group>
          </b-col>
          <b-col cols="12">
            <VuePdfEmbed :source="src" :page="1" :class="scaleClass"/>
          </b-col>
        </b-row>
      </b-col>
      <b-col md="6" lg="5" class="p-3" order="1" order-md="2">
        <b-col class="pdf-data shadow text-start pt-4 pb-4 px-3">
          <b-row class="px-3">
            <b-col cols="12">
              <h3>Nombre: </h3>
              <b-form-input v-model="file.title" type="text" readonly/>
              <br/>
            </b-col>
            <b-col cols="12">
              <h3>Código: </h3>
              <b-form-input v-model="file.code" type="text" readonly/>
              <br/>
            </b-col>
            <b-col cols="12">
              <h3>Fecha de Creación: </h3>
              <b-form-input v-model="file.creation_date" type="text" readonly/>
            </b-col>
          </b-row>
        </b-col>
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
  components: {
    VuePdfEmbed,
  },
  props: {
    branch: {type: Branch, required: true},
    code: {type: String, required: true},
    file_name: {type: String, required: true},
    preRoute: {type: String, required: true}
  },
  data() {
    return {
      file: {
        title: '',
        code: '',
        creation_date: ''
      },
      scale: 1
    }
  },
  computed: {
    src(): String {
      return `http://localhost:8000/files/${this.branch.name}/${this.code}/${this.file_name}`
    },
    scaleClass(): String {
      return `scale-${this.scale}`
    }
  },
  mounted() {
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
    async downloadFile() {
      const response = await this.axios.get(`files/${this.branch.name}/${this.code}/${this.file_name}`);
      const blob = new Blob([response.data], {type: "application/pdf"});
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = this.file_name;
      link.click();
    },
    returnToFileList(){
      this.$router.replace({name: 'FolderFiles', params: {branch: JSON.stringify(this.branch), folder: this.code, preRoute: this.preRoute}});
    }
  }
})
</script>

<style lang="scss">
@use "sass:math";

@function calc_translate($i) {
  @return math.percentage((12.5 * $i - 12.5)/100);
}

@function calc_scale($i) {
  @return ($i + 3)/4;
}

.pdf-viewer {
  padding: 15px;
  border-radius: 15px;
  background-color: white;
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

.vue-pdf-embed {
  div {
    overflow: auto;

    canvas {
      height: 100% !important;
      width: 100% !important;
      transition: transform ease-in-out 0.5s;
    }
  }


  @for $i from 1 through 15 {
    &.scale-#{$i} {
      div {
        canvas {
          transform: translate(calc_translate($i), calc_translate($i)) scale(calc_scale($i));
        }
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