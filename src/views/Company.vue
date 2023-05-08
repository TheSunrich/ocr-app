<template>
  <b-container fluid class="screen">
    <b-row>
      <b-col md="12">
        <h2 class="title">{{company.name}}</h2>
        <b-card style="padding: 10px">
          <b-container fluid class="company-detail">
            <b-row no-gutters style="margin: 0 10px;" class="detail-info">
              <b-col cols="12" md="6" class="text-left">
                <h3>RFC: <span>{{ company.rfc }}</span></h3>
              </b-col>
              <b-col cols="12" md="6" class="text-left">
                <h3>Nombre comercial: <span>{{ company.companyName }}</span></h3>
              </b-col>
              <b-col cols="12" md="6" class="text-left">
                <h3>Email: <span>{{ company.email }}</span></h3>
              </b-col>
              <b-col cols="12" md="6" class="text-left">
                <h3>Razón Social: <span>{{ company.businessLine }}</span></h3>
              </b-col>
              <b-col cols="12" md="6" class="text-left">
                <h3>Teléfono: <span>{{ company.phone }}</span></h3>
              </b-col>
            </b-row>
            <hr/>
            <b-row>
              <b-col cols="12">
                <b-row>
                  <b-col cols="12" md="auto" class="mx-4">
                    <h4>Usuarios</h4>
                  </b-col>
                  <b-col cols="12" md="4" class="ml-md-auto">
                    <b-form-input
                        class="search-bar"
                        v-model="txtSearch"
                        placeholder="Búsqueda"
                        type="search"
                        size="sm"
                        @update="search"
                    ></b-form-input>
                  </b-col>
                  <b-col cols="12" md="auto">
                    <b-button block variant="green" v-b-modal.addClient size="sm">
                      <font-awesome-icon icon="fa-solid fa-plus" size="lg"/>
                    </b-button>
                    <b-modal
                        id="addClient"
                        title="Agregar Nuevo Usuario"
                        header-bg-variant="blue"
                        header-text-variant="light"
                        okVariant="danger"
                        okTitle="Aceptar"
                        cancelTitle="Cancelar"
                        @show="emptyForm"
                        @hidden="emptyForm"
                        @ok="handleOk"
                        centered>
                      <b-form class="container-fluid" ref="addUser" @submit.stop.prevent="add">
                        <b-form-group class="mb-3" label="Nombre:">
                          <b-form-input id="name" name="name" type="text" v-model.trim="newClient.name" required
                                        :state="nameState"></b-form-input>
                        </b-form-group>
                        <b-form-group class="mb-3" label="Teléfono:">
                          <b-form-input id="phone" name="phone" type="phone" v-model.trim="newClient.phone"
                                        required :state="phoneState"></b-form-input>
                        </b-form-group>
                        <b-form-group class="mb-3" label="Email:">
                          <b-form-input id="email" name="email" type="email" v-model.trim="newClient.email"
                                        required :state="emailState"></b-form-input>
                        </b-form-group>
                        <b-form-group class="mb-3" label="Nombre de usuario:">
                          <b-form-input id="username" name="username" type="text" v-model.trim="newClient.username" required
                                        :state="usernameState"></b-form-input>
                        </b-form-group>
                        <b-form-group class="mb-3" label="Nueva Contraseña: " :state="pwdState">
                          <b-form-input id="pwd" name="pwd" type="password" v-model.trim="newClient.pwd"
                                        required :state="pwdState"></b-form-input>
                          <b-form-invalid-feedback>
                            El campo 'Nueva Contraseña' es requerido
                          </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group class="mb-3" label="Confirmar Contraseña: ">
                          <b-form-input id="pwd_2" name="pwd_2" type="password" v-model.trim="pwd_check"
                                        required :state="pwdState2"></b-form-input>
                          <b-form-invalid-feedback>
                            El campo 'Confirmar Contraseña' es requerido
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-form>
                    </b-modal>
                  </b-col>
                </b-row>
                <br/>
                <b-table-simple striped hover>
                  <thead>
                  <tr>
                    <th class="text-left">Nombre</th>
                    <th class="text-left">Nombre de usuario</th>
                    <th class="text-left">Telefono</th>
                    <th class="text-left">Email</th>
                    <th class="text-left b-col-2"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <ClientRow v-for="item in clients" :id="item.id" :client-old="item" :key="item.id"/>
                  </tbody>
                </b-table-simple>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Client from "@/models/client";
import {emitter} from "@/main";
import Company from "@/models/company";
import ClientRow from "@/components/Client/ClientRow.vue";

export default defineComponent({
  name: "Company",
  components:{
    ClientRow
  },
  data() {
    return {
      company: {} as Company,
      txtSearch: '',
      clients: [] as Client[] | null,
      clientsData: [] as Client[],
      pwd_check: '',
      nameState: null as boolean | null,
      phoneState: null as boolean | null,
      emailState: null as boolean | null,
      usernameState: null as boolean | null,
      pwdState: null as boolean | null,
      pwdState2: null as boolean | null,
      newClient:{
        username: '',
        pwd: '',
        role: 1,
        name: '',
        phone: '',
        email: '',
        idCompany: this.$store.state.user.idCompany,
      }
    }
  },
  mounted() {
    this.getCompany();
    this.getList();
    emitter.on('update-client-list', this.getList);
  },
  methods: {
    getCompany(){
      this.axios.get(`company/${this.$store.state.user.client.idCompany}`).then((response: any) => {
        if(response.data.success == 1){
          this.company = response.data.data;
        }
      })
    },
    getList(){
      this.axios.get(`client/${this.$store.state.user.client.idCompany}`).then((response: any) => {
        if(response.data.success == 1){
          this.clients = response.data.data;
          this.clientsData = response.data.data;
        }
      })
    },
    returnToCompanies() {
      emitter.emit('set-selected-company', {selectedCompany: {}});
      emitter.emit('is-selected-company', false);
    },
    search() {
      let data: any = [];
      this.clientsData.forEach((value: any) => {
        if (value.name.toLowerCase().includes(this.txtSearch.toLowerCase())) {
          data.push(value);
        }
      });
      this.clients = data;
    },
    handleOk(bvModalEvent: any) {
      bvModalEvent.preventDefault()
      this.add()
    },
    checkFormValidity() {
      const form: any = this.$refs.addUser;
      this.nameState = form.name.checkValidity()
      this.phoneState = form.phone.checkValidity()
      this.emailState = form.email.checkValidity()
      this.usernameState = form.username.checkValidity()
      this.pwdState = form.pwd.checkValidity()
      this.pwdState2 = form.pwd_2.checkValidity()
      return form.checkValidity() && this.newClient.pwd === this.pwd_check;
    },
    emptyForm() {
      this.newClient.name = '';
      this.newClient.phone = '';
      this.newClient.email = '';
      this.newClient.username = '';
      this.newClient.pwd = '';
      this.pwd_check = '';
      this.nameState = null;
      this.nameState = null;
      this.phoneState = null;
      this.emailState = null;
      this.usernameState = null;
      this.pwdState = null;
      this.pwdState2 = null;
    },
    add(){
      if (!this.checkFormValidity()) {
        return;
      }

      this.axios.post(`client`, this.newClient).then(response => {
        if (response.data.success === 1) {
          emitter.emit('show-toast', {
            title: 'Agregación de Cliente',
            description: 'El cliente ha sido agregado correctamente',
            type: 'success'
          });
          this.getList();
        } else {
          switch (response.data.error.code) {
            case 431:
              emitter.emit('show-toast', {
                title: 'Error al agregar cliente',
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
                title: 'Error al agregar cliente',
                description: desc.substring(0, desc.length - 1),
                type: 'error'
              });
              break;
            default:
              emitter.emit('show-toast', {
                title: 'Error al agregar cliente',
                description: 'Error al agregar al cliente',
                type: 'error'
              });
              break;
          }
        }
      }).catch(reason => {
        console.log(reason)
        emitter.emit('show-toast', {
          title: 'Error al agregar cliente',
          description: 'Error al agregar al cliente',
          type: 'error'
        });
      }).finally(() => {
        this.emptyForm()
        this.$bvModal.hide('addClient');
      });
    },

  }
})
</script>

<style scoped lang="scss">
h3 {
  font-size: 18px;
}

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
</style>