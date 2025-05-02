<script setup>
import DonorStatus from '@/components/donation/DonorStatus.vue';
import InfoDonor from '@/components/donation/InfoDonor.vue';
import { useDonationStore } from '@/stores/donation/donations';
import { useDonorStore } from '@/stores/donation/donor';

import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
const donorStore = useDonorStore();
const donationStore = useDonationStore();
const loading = ref(false);
const route = useRoute();

const donor = reactive({
  documentType: '',
  documentNumber: '',
  firstName: '',
  lastName: '',
  secondLastName: '',
  birthDate: null,
  gender: '',
  email: '',
  phone: '',
  region: null,
  province: null,
  district: null,
  address: '',
  occupation: '',
  placeOfBirth: '',
  placeOfOrigin: '',
  maritalStatus: '',
  deferralEndDate: null,
  deferralReason: '',
  status: '',
  trips: ''
});

const columns = [
  { field: 'id', header: 'Código', width: '12%' },
  { field: 'bloodBankName', header: 'Banco de sangre', width: '30%' },
  { field: 'date', header: 'Fecha de donación', width: '20%' },
  { field: 'status', header: 'Estado', width: '12%' }
];

onMounted(async () => {
  const documentNumber = route.params.doc;
  const documentType = route.params.type;
  await donationStore.getDonationsByDocumentDonor(documentNumber, documentType);
  const donorResponse = await donorStore.getDonor(documentNumber, documentType);
  Object.assign(donor, { ...donor, ...donorResponse });
});
</script>
<template>
  <div class="card">
    <div class="mb-4">
      <h3>Visualizar Donante</h3>
    </div>
    <DonorStatus :document-number="donor.documentNumber" :status="donor.status" :deferral-end-date="donor.deferralEndDate" :deferral-reason="donor.deferralReason" :gender="donor.gender" :last-donation-date="donor.lastDonationDate" />

    <!-- Datos generales del donante -->
    <Fieldset legend="Datos generales del donante" class="!mb-4">
      <div class="rounded-md px-5 pt-5 pb-2 bg-white">
        <InfoDonor :donor="donor" :isEditable="true" />
      </div>
    </Fieldset>

    <!-- Sección de Donaciones -->
    <div>
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl">Donaciones</h2>
        <Button label="Nueva Donación" icon="pi pi-plus" class="h-8 p-button-success" />
      </div>

      <!-- Tabla de donaciones -->
      <div class="w-full">
        <DataTable
          :value="donorStore.donationsByDonor"
          tableStyle="min-width: 50rem"
          paginator
          :rows="10"
          :totalRecords="donorStore.totalRecordsDonationsByDonor"
          lazy
          :loading="loading"
          showGridlines
          :currentPageReportTemplate="'{currentPage} de {totalPages}'"
        >
          <template #empty>
            <p class="text-gray-600 text-lg py-4">No encontramos donaciones para este donante.</p>
          </template>

          <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :style="`width: ${col.width}`">
            <template v-if="col.field === 'status'" #body="slotProps"> {{ Status[slotProps.data.status] }} </template>
          </Column>
          <Column header="Acciones">
            <template #body="slotProps">
              <div class="flex flex-wrap w-full">
                <Button class="h-8 w-[6rem] mr-1 my-1 btn-view" label="Visualizar" as="router-link" :to="`/admin/users/${slotProps.data.id}`" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
