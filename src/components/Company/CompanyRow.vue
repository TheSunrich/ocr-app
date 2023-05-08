<template>
  <tr class="text-left" :key="company.id">
    <td>{{ companyOld.name }}</td>
    <td>{{ companyOld.companyName }}</td>
    <td>{{ companyOld.rfc }}</td>
    <td>{{ companyOld.email }}</td>
    <td class="text-left">{{ companyOld.phone }}</td>
    <td class="text-right">
      <div>
        <b-button size="sm" variant="grey" class="m-1" @click="setSelectedCompany">
          <font-awesome-icon icon="fa-solid fa-list" size="sm"/>
        </b-button>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import {emitter} from '@/main';
import {defineComponent} from 'vue';
import Company from "@/models/company";

export default defineComponent({
  name: "CompanyRow",
  props: {
    companyOld: {type: Company, required: true},
    id: {type: Number, required: true}
  },
  data() {
    return {
      show: {
        delete: false,
        update: false,
      },
      company: {} as Company,
      businessLineState: null as null | boolean,
    }
  },
  mounted() {
    this.getSingle();
  },
  methods: {
    getSingle() {
      this.axios.get(`company/${this.id}`).then((response: any) => {
        if (response.data.success === 1) {
          this.company = response.data.data;
        }
      }).catch(reason => {
        console.log(reason);
      });
    },
    setSelectedCompany() {
      emitter.emit('set-selected-company', {selectedCompany: this.companyOld});
      emitter.emit('is-selected-company', true);
    },
  }
})
</script>

<style scoped lang="scss">

</style>