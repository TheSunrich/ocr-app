<template>
  <tr class="text-left" :key="client.id">
    <td>{{ clientOld.name }}</td>
    <td>{{ clientOld.username }}</td>
    <td>{{ clientOld.phone }}</td>
    <td>{{ clientOld.email }}</td>
    <td class="text-right">
      <div>
        <b-button variant="blue" @click="show.update = true" class="m-1" size="sm">
          <font-awesome-icon icon="fa-solid fa-pencil"/>
        </b-button>
        <b-modal
            :id="`updateClient-${client.id}`"
            v-model="show.update"
            title="Modificar Cliente"
            header-bg-variant="blue"
            header-text-variant="light"
            okVariant="success"
            okTitle="Aceptar"
            cancelTitle="Cancelar"
            @show="emptyForm"
            @hidden="emptyForm"
            @ok="handleOk"
            centered>
          <b-form class="container-fluid" :ref="`updateClient-${client.id}`" @submit.stop.prevent="updateClient">
            <b-form-group class="mb-3" label="Nombre:">
              <b-form-input id="name" name="name" type="text" v-model.trim="client.name" required
                            :state="nameState"></b-form-input>
            </b-form-group>
            <b-form-group class="mb-3" label="Teléfono:">
              <b-form-input id="phone" name="phone" type="text" v-model.trim="client.phone" size
                            required :state="phoneState"></b-form-input>
            </b-form-group>
            <b-form-group class="mb-3" label="Email:">
              <b-form-input id="email" name="email" type="email" v-model.trim="client.email"
                            required :state="emailState"></b-form-input>
            </b-form-group>
            <b-form-group class="mb-3" label="Nombre de usuario:">
              <b-form-input id="username" name="username" type="text" v-model.trim="client.username" required
                            :state="usernameState"></b-form-input>
            </b-form-group>
            <b-form-group class="mb-3" label="Nueva Contraseña: " :state="pwdState">
              <b-form-input id="pwd" name="pwd" type="password" v-model.trim="client.pwd"
                            :state="pwdState"></b-form-input>
              <b-form-invalid-feedback>
                El campo 'Nueva Contraseña' es requerido
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="mb-3" label="Confirmar Contraseña: ">
              <b-form-input id="pwd_2" name="pwd_2" type="password" v-model.trim="pwd_check"
                            :state="pwdState2"></b-form-input>
              <b-form-invalid-feedback>
                El campo 'Confirmar Contraseña' es requerido
              </b-form-invalid-feedback>
            </b-form-group>
          </b-form>
        </b-modal>
        <b-button variant="red" @click="showModal" class="m-1" size="sm">
          <font-awesome-icon icon="fa-solid fa-trash"/>
        </b-button>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Client from "@/models/client";
import {emitter} from "@/main";

export default defineComponent({
  name: "ClientRow",
  props: {
    clientOld: {type: Client, required: true},
    id: {type: Number, required: true}
  },
  data() {
    return {
      client: {} as any,
      pwd_check: '',
      show: {
        update: false,
        delete: false,
      },
      nameState: null as boolean | null,
      phoneState: null as boolean | null,
      emailState: null as boolean | null,
      usernameState: null as boolean | null,
      pwdState: null as boolean | null,
      pwdState2: null as boolean | null,
    }
  },
  mounted() {
    this.client = Object.assign({}, this.clientOld)
  },
  methods: {
    handleOk(bvModalEvent: any) {
      bvModalEvent.preventDefault()
      this.updateClient()
    },
    checkFormValidity() {
      const form: any = this.$refs[`updateClient-${this.client.id}`];
      this.nameState = form.name.checkValidity()
      this.phoneState = form.phone.checkValidity()
      this.emailState = form.email.checkValidity()
      this.usernameState = form.username.checkValidity()
      this.pwdState = form.pwd.checkValidity()
      this.pwdState2 = form.pwd_2.checkValidity()
      return form.checkValidity() && this.client.pwd === this.pwd_check;
    },
    emptyForm() {
      this.client.name = this.clientOld.name;
      this.client.phone = this.clientOld.phone;
      this.client.email = this.clientOld.email;
      this.client.username = this.clientOld.username;
      this.client.pwd = '';
      this.pwd_check = '';
      this.nameState = null;
      this.nameState = null;
      this.phoneState = null;
      this.emailState = null;
      this.usernameState = null;
      this.pwdState = null;
      this.pwdState2 = null;
    },
    updateClient() {
      if (!this.checkFormValidity()) {
        return;
      }

      let data: any = {}
      data['name'] = this.client.name;
      data['phone'] = this.client.phone;
      data['email'] = this.client.email;
      data['username'] = this.client.username;
      data['pwd'] = this.client.pwd;

      this.axios.put(`client/${this.clientOld.id}`, data).then(response => {
        if (response.data.success === 1) {
          emitter.emit('show-toast', {
            title: 'Modificación de Cliente',
            description: 'El cliente ha sido modificado correctamente',
            type: 'success'
          });
          emitter.emit('update-client-list')
        } else {
          switch (response.data.error.code) {
            case 431:
              emitter.emit('show-toast', {
                title: 'Error al modificar cliente',
                description: 'El cliente ya ha sido registrado',
                type: 'error'
              });
              break;
            case 432:
              const args = response.data.data;
              let desc = "Valor incorrecto para";
              for (const argsKey in args) {
                switch (argsKey) {
                  case 'name':
                    desc += ` Nombre de la empresa,`;
                    break;
                  case 'companyName':
                    desc += ` Razón Social,`;
                    break;
                  case 'email':
                    desc += ` Email,`;
                    break;
                  case 'laborUnion':
                    desc += ` Unión Laboral,`;
                    break;
                  case 'rfc':
                    desc += ` RFC,`;
                    break;
                  case 'businessLine':
                    desc += ` Giro empresarial,`;
                    break;
                }
              }
              emitter.emit('show-toast', {
                title: 'Error al modificar cliente',
                description: desc.substring(0, desc.length - 1),
                type: 'error'
              });
              break;
            default:
              emitter.emit('show-toast', {
                title: 'Error al modificar cliente',
                description: 'Error al modificar al cliente',
                type: 'error'
              });
              break;
          }
        }
      }).catch(reason => {
        console.log(reason)
        emitter.emit('show-toast', {
          title: 'Error al modificar cliente',
          description: 'Error al modificar al cliente',
          type: 'error'
        });
      }).finally(() => {
        this.emptyForm()
        this.show.update = false;
      });
    },
    showModal() {
      this.$bvModal.msgBoxConfirm('¿Esta seguro de querer eliminar al usuario?', {
        title: 'Eliminar usuario',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Aceptar',
        headerBgVariant: 'red',
        headerTextVariant: 'light',
        cancelTitle: 'Cancelar',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true,
        noCloseOnEsc: true,
        noCloseOnBackdrop: true
      }).then(value => {
        if (value) {
          const title = 'Eliminación de usuario';
          let toastArgs = {};
          this.axios.patch(`client/${this.client.id}/delete`).then(response => {
            if (response.data.hasOwnProperty('error')) {
              return;
            } else if (response.data.hasOwnProperty('success')) {
              toastArgs = {
                title: title,
                description: 'El usuario se ha eliminado correctamente',
                type: 'success'
              }
            }
            emitter.emit('show-toast', toastArgs);
            emitter.emit('update-client-list')
          }).catch(error => {
            if (error.response.data.hasOwnProperty('error')) {
              switch (error.response.data.error.code) {
                case 426:
                  toastArgs = {
                    title: title,
                    description: 'El usuario ya ha sido eliminado',
                    type: 'warning'
                  }
                  break;
                case 420:
                  toastArgs = {
                    title: title,
                    description: 'El usuario no ha podido ser eliminado',
                    type: 'error'
                  }
                  break;
                case 414:
                  toastArgs = {
                    title: title,
                    description: 'El usuario no existe',
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
        }
      })
    },
  },
})
</script>

<style scoped lang="scss">

</style>