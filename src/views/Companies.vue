<template>
  <b-container fluid class="screen">
    <b-row>
      <transition name="minimize">
        <b-col md="12" v-if="!isSelected">
          <h2 class="title">Empresas</h2>
          <b-card class="table-container">
            <b-container fluid>
              <b-row>
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
                  <b-button block variant="green" v-b-modal.addCompany size="sm">
                    <font-awesome-icon icon="fa-solid fa-plus" size="xl"/>
                  </b-button>
                  <b-modal
                      id="addCompany"
                      title="Agregar Nueva Empresa"
                      header-bg-variant="blue"
                      header-text-variant="light"
                      okVariant="danger"
                      okTitle="Aceptar"
                      cancelTitle="Cancelar"
                      @show="emptyForm"
                      @hidden="emptyForm"
                      @ok="handleOk"
                      centered>
                    <b-form class="container-fluid" ref="addCompany" @submit.stop.prevent="add">
                      <b-row>
                        <b-col cols="12" md="12">
                          <b-form-group class="mb-3" label="Razón Social:">
                            <b-form-input
                                id="businessLine"
                                name="businessLine"
                                type="text"
                                v-model.trim="newCompany.businessLine"
                                required
                                :state="businessLineState"
                            ></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col cols="12" md="12">
                          <b-form-group class="mb-3" label="RFC:">
                            <b-form-input
                                id="rfc"
                                name="rfc"
                                type="text"
                                v-model.trim="newCompany.rfc"
                                required
                                :state="rfcState"
                            ></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                    </b-form>
                  </b-modal>
                </b-col>
              </b-row>
            </b-container>
            <br/>
            <b-table-simple striped hover>
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left">Nombre</th>
                  <th class="text-left">Razón Social</th>
                  <th class="text-left">RFC</th>
                  <th class="text-left">Email</th>
                  <th class="text-left">Teléfono</th>
                  <th style="width: 110px"></th>
                </tr>
                </thead>
                <tbody>
                <Transition name="list" tag="div" class="row" mode="out-in">
                  <tr v-if="companies.length <= 0 && !afterResult">
                    <td colspan="6">
                      <b-spinner style="margin: 15px; width: 3rem; height: 3rem;" label="Spinning"></b-spinner>
                    </td>
                  </tr>
                </Transition>
                <CompanyRow v-for="item in companies" :company-old="item" :id="item.id" :key="item.id"/>
                <transition name="fade-no-content">
                  <tr v-if="companies.length <= 0 && afterResult">
                    <td colspan="6">
                      <h5 class="no-content">No se han encontrado empresas</h5>
                    </td>
                  </tr>
                </transition>
                </tbody>
              </template>
            </b-table-simple>
            &nbsp;
          </b-card>
        </b-col>
      </transition>
      <transition name="minimize">
        <b-col md="12" v-if="isSelected">
          <CompanyComponent :selected="selectedCompany"/>
        </b-col>
      </transition>

    </b-row>
  </b-container>
</template>

<script lang="ts">
import CompanyComponent from "@/components/Company/Company.vue";
import {emitter} from "@/main";
import {defineComponent} from "vue";
import CompanyRow from "@/components/Company/CompanyRow.vue";
import Company from "@/models/company";

export default defineComponent({
  name: "Companies",
  components: {
    CompanyRow,
    CompanyComponent
  },
  data() {
    return {
      afterResult: false,
      txtSearch: '',
      companies: [] as Company[] | null,
      companiesData: [] as Company[],
      isSelected: false,
      selectedCompany: {} as Company,
      newCompany: {
        rfc: '',
        businessLine: '',
      },
      rfcState: null,
      businessLineState: null,
    }
  },
  mounted() {
    emitter.emit('check-routes');
    this.getList();
    emitter.on('update-company-list', this.getList);
    emitter.on('is-selected-company', (isSelected: any) => {
      this.isSelected = isSelected
    });
    emitter.on('set-selected-company', this.setSelectedCompany);

  },
  methods: {
    handleOk(bvModalEvent: any) {
      bvModalEvent.preventDefault()
      this.add()
    },
    checkFormValidity() {
      const form: any = this.$refs.addCompany;
      this.businessLineState = form.businessLine.checkValidity()
      this.rfcState = form.rfc.checkValidity()
      return form.checkValidity();
    },
    emptyForm() {
      this.newCompany.rfc = '';
      this.newCompany.businessLine = '';
      this.rfcState = null;
      this.businessLineState = null;
    },
    setSelectedCompany(args: any) {
      this.selectedCompany = args.selectedCompany;
    },
    getList() {
      this.axios.get(`company`).then(response => {
        if (response.data.success === 1) {
          this.companies = response.data.data;
          this.companiesData = response.data.data;
        }
      }).catch(reason => {
        console.log(reason)
      }).finally(() => {
        this.afterResult = true
      });
    },
    add() {
      if (!this.checkFormValidity()) {
        return;
      }

      this.axios.post(`company/add`, this.newCompany).then(response => {
        if (response.data.success === 1) {
          emitter.emit('show-toast', {
            title: 'Agregación de Empresa',
            description: 'La empresa ha sido agregada correctamente',
            type: 'success'
          });
          this.getList();
        } else {
          switch (response.data.error.code) {
            case 430:
              emitter.emit('show-toast', {
                title: 'Error al agregar empresa',
                description: 'La compañía ya ha sido registrada',
                type: 'error'
              });
              break;
            case 434:
              emitter.emit('show-toast', {
                title: 'Error al agregar empresa',
                description: 'La compañía no esta registrada en la base de datos de TJO',
                type: 'error'
              });
              break;
            default:
              emitter.emit('show-toast', {
                title: 'Error al agregar empresa',
                description: 'Error al agregar la empresa',
                type: 'error'
              });
              break;
          }
        }
      }).catch(reason => {
        console.log(reason)
        emitter.emit('show-toast', {
          title: 'Error al agregar empresa',
          description: 'Error al agregar la empresa',
          type: 'error'
        });
      }).finally(() => {
        this.emptyForm()
        this.$bvModal.hide('addCompany');
      });
    },
    search() {
      let data: any = [];
      this.companiesData.forEach((value: any) => {
        if (value.name.toLowerCase().includes(this.txtSearch.toLowerCase())) {
          data.push(value);
        }
      });
      this.companies = data;
    },
    searchClear() {
      this.txtSearch = '';
      this.companies = this.companiesData;
    },
  },
})
</script>

<style lang="scss">


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

.screen {
  max-height: calc(100vh - 80px);
  padding-top: 0;

  .title {
    text-align: left;
    font-size: 1.75rem !important;
    color: #737F8B !important;
    margin: 10px 15px;
    font-weight: 750;
  }
}

.minimize-enter-active,
.minimize-leave-active {
  transition: max-height 1.25s ease-in-out, opacity 0.75s ease-in-out;
}

.minimize-leave-to,
.minimize-enter-from {
  max-height: 0;
  opacity: 0;
}

.minimize-leave-from,
.minimize-enter-to {
  max-height: none;
  opacity: 1;
}

.search-bar:focus {
  border-color: #78d35d;
  box-shadow: 0 0 0 0.25rem #46fd0d40;
}

</style>