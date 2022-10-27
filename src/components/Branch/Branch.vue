<template>
  <b-col sm="6" md="4" lg="3" xl="2" class="py-3">
    <b-card no-body class="btn-branch shadow-sm">
      <a class="btn-action btn-update" @click="updateBranch">
        <font-awesome-icon icon="fa-solid fa-pencil" size="sm"/>
      </a>
      <a class="btn-action btn-lock" @click="unlockBranch" v-if="branch.status === 2">
        <font-awesome-icon icon="fa-solid fa-lock" size="sm"/>
      </a>
      <a class="btn-action btn-unlock" @click="lockBranch" v-else-if="branch.status === 1">
        <font-awesome-icon icon="fa-solid fa-lock-open" size="sm"/>
      </a>
      <a class="btn-action btn-delete" @click="deleteBranch">
        <font-awesome-icon icon="fa-solid fa-trash" size="sm"/>
      </a>
      <blockquote class="card-blockquote" @click="detail">
        <font-awesome-icon class="btn-icon m-4" icon="fa-solid fa-code-branch" size="4x"/>
        <h2>{{ branch.name }}</h2>
      </blockquote>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Branch from "@/models/branch";
import {emitter} from "@/main";

export default defineComponent({
  name: "BranchComponent",
  props: {
    branch: {type: Object as PropType<Branch>, required: true}
  },
  methods: {
    detail() {
      console.log('prueba')
    },
    updateBranch() {
      //this.axios.put(`branch/${this.branch.id}`).then().catch()
    },
    lockBranch() {
      const title = 'Bloqueo de sucursal';
      let toastArgs = {};
      this.axios.patch(`branch/${this.branch.id}/lock`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'La sucursal se ha bloqueado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('branch-getall');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 469:
              toastArgs = {
                title: title,
                description: 'La sucursal ya ha sido eliminada y no hay permisos para reactivar la sucursal',
                type: 'error'
              }
              break;
            case 466:
              toastArgs = {
                title: title,
                description: 'La sucursal ya ha sido bloqueada',
                type: 'warning'
              }
              break;
            case 460:
              toastArgs = {
                title: title,
                description: 'La sucursal no ha podido ser bloqueada',
                type: 'error'
              }
              break;
            case 464:
              toastArgs = {
                title: title,
                description: 'La sucursal no existe',
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
    unlockBranch() {
      const title = 'Desbloqueo de sucursal';
      let toastArgs = {};
      this.axios.patch(`branch/${this.branch.id}/activate`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')) {
          toastArgs = {
            title: title,
            description: 'La sucursal se ha desbloqueado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('branch-getall');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 469:
              toastArgs = {
                title: title,
                description: 'La sucursal ya ha sido eliminada y no hay permisos para reactivar la sucursal',
                type: 'error'
              }
              break;
            case 466:
              toastArgs = {
                title: title,
                description: 'La sucursal ya ha sido desbloqueada',
                type: 'warning'
              }
              break;
            case 460:
              toastArgs = {
                title: title,
                description: 'La sucursal no ha podido ser desbloqueada',
                type: 'error'
              }
              break;
            case 464:
              toastArgs = {
                title: title,
                description: 'La sucursal no existe',
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
    deleteBranch() {
      const title = 'Eliminación de sucursal';
      let toastArgs = {};
      this.axios.patch(`branch/${this.branch.id}/delete`).then(response => {
        if (response.data.hasOwnProperty('error')) {
          return;
        } else if (response.data.hasOwnProperty('success')){
          toastArgs = {
            title: title,
            description: 'La sucursal se ha eliminado correctamente',
            type: 'success'
          }
        }
        emitter.emit('show-toast', toastArgs);
        emitter.emit('branch-getall');
      }).catch(error => {
        if (error.response.data.hasOwnProperty('error')) {
          switch (error.response.data.error.code) {
            case 426:
              toastArgs = {
                title: title,
                description: 'La sucursal ya ha sido eliminada',
                type: 'warning'
              }
              break;
            case 420:
              toastArgs = {
                title: title,
                description: 'La sucursal no ha podido ser eliminada',
                type: 'error'
              }
              break;
            case 414:
              toastArgs = {
                title: title,
                description: 'La sucursal no existe',
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
  }
})
</script>

<style scoped lang="scss">

@function top_space($btn_num) {
  @return 33 * $btn_num - 24;
}

.btn-branch {
  border: none;
  transition: background-color ease-in-out 0.15s;

  &:hover {
    background-color: rgba(44, 62, 80, 0.15);
  }

  &:has(> .btn-update:hover) {
    background-color: #FFF;
  }

  &:has(> .btn-lock:hover) {
    background-color: #FFF;
  }

  &:has(> .btn-delete:hover) {
    background-color: #FFF;
  }

  &:active {
    background-color: rgba(44, 62, 80, 0.45);
  }


  .btn-action {
    transition: background-color ease-in-out 0.25s, color ease-in-out 0.25s, top ease-in-out 0.25s, right ease-in-out 0.25s, width ease-in-out 0.25s, height ease-in-out 0.25s;
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    border-radius: 100rem;

    &.btn-update {
      top: #{top_space(1)}px;
      right: 9px;
      width: 26px;
      height: 26px;
      background-color: white;
      color: #2747bb;

      &:hover {
        top: #{top_space(1) - 1}px;
        right: 8px;
        width: 28px;
        height: 28px;
        background-color: #2747bb;
        color: white;
      }

      svg {
        display: block;
        align-self: auto;
      }
    }

    &.btn-lock {
      top: #{top_space(2)}px;
      right: 9px;
      width: 26px;
      height: 26px;
      background-color: white;
      color: #ce7d2b;

      &:hover {
        top: #{top_space(2) - 1}px;
        right: 8px;
        width: 28px;
        height: 28px;
        background-color: #ce7d2b;
        color: white;
      }

      svg {
        display: block;
        align-self: auto;
      }
    }

    &.btn-unlock {
      top: #{top_space(2)}px;
      right: 9px;
      width: 26px;
      height: 26px;
      background-color: white;
      color: #36ce2b;

      &:hover {
        top: #{top_space(2) - 1}px;
        right: 8px;
        width: 28px;
        height: 28px;
        background-color: #36ce2b;
        color: white;
      }

      svg {
        display: block;
        align-self: auto;
      }
    }


    &.btn-delete {
      top: #{top_space(3)}px;
      right: 9px;
      width: 26px;
      height: 26px;
      background-color: white;
      color: #ce2b2b;

      &:hover {
        top: #{top_space(3) - 1}px;
        right: 8px;
        width: 28px;
        height: 28px;
        background-color: #ce2b2b;
        color: white;
      }

      svg {
        display: block;
        align-self: auto;
      }
    }
  }

  .card-blockquote {
    user-select: none;

    .btn-icon {
      margin: 2.25rem !important;
    }

    h2 {
      margin: 0;
      padding: 0 10px;
      text-align: center;
      font-size: 20px;
    }
  }
}


</style>