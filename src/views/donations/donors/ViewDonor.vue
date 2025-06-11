<script setup>
import DonationForm from '@/components/donation/DonationForm.vue';
import DonorStatusCard from '@/components/donation/DonorStatusCard.vue';
import InfoDonor from '@/components/donation/InfoDonor.vue';
import { useDonationStore } from '@/stores/donation/donations';
import { useDonorStore } from '@/stores/donation/donor';

import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const donorStore = useDonorStore();
const donationStore = useDonationStore();
const loading = ref(false);
const route = useRoute();
const documentNumber = computed(() => route.params.doc);
const documentType = computed(() => route.params.type);

const actuadlDonationId = ref(null);
const lastDonationDateDetail = ref(null);
const canDonateDateLastDonation = ref(true);
const necesitaAdvertencia = ref(false);
const isLoading = ref(true);

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

const succesNewDoantion = async () => {
  await donationStore.getDonationsByDocumentDonor(documentNumber.value, documentType.value);
  isOpenDialogDonation.value = false;
};

const goViewDonation = (id) => {
  router.push({
    path: '/donation/view',
    query: { donationId: id }
  });
};

// function necesitaAdvertenciaPorDonacion(status, lastDonationDate, gender) {
//   if (status !== 'Apto' || !lastDonationDate || !gender) return false;

//   const generoConfig = Gender[gender];
//   if (!generoConfig || !generoConfig.minMonthsBetweenDonations) return false;
//   const [day, month, year] = lastDonationDate.split('/');
//   const ultima = new Date(year, month - 1, day);
//   const hoy = new Date();
//   let diferenciaMeses = (hoy.getFullYear() - ultima.getFullYear()) * 12 + hoy.getMonth() - ultima.getMonth();
//   if (hoy.getDate() < ultima.getDate()) diferenciaMeses--;
//   return diferenciaMeses < generoConfig.minMonthsBetweenDonations;
// }

onMounted(async () => {
  const documentNumber = route.params.doc;
  const documentType = route.params.type;
  await donationStore.getDonationsByDocumentDonor(documentNumber, documentType);
  const donorResponse = await donorStore.getDonor(documentNumber, documentType);
  Object.assign(donor, { ...donor, ...donorResponse });

  const actualDonationResponse = await donationStore.getActualDonation(documentNumber, documentType);
  //Id actual donación en proceso
  actuadlDonationId.value = actualDonationResponse ? actualDonationResponse.id : null;
  const lastDonationDateDetailResponse = await donationStore.getLastDateDonation(documentNumber, documentType);
  //Detalle de fecha de ultima donación
  lastDonationDateDetail.value = lastDonationDateDetailResponse;
  //Si puedes donar despues del tiempo de la última donación
  canDonateDateLastDonation.value = lastDonationDateDetailResponse ? lastDonationDateDetailResponse.isEnableDonation : true;
  necesitaAdvertencia.value = lastDonationDateDetailResponse ? lastDonationDateDetailResponse.requiredAdvertisement : false;
  // necesitaAdvertencia.value = necesitaAdvertenciaPorDonacion(donor.status, lastDonationDateDetail.value?.dateDonation || null, donor.gender);
  isLoading.value = false;
});

const isOpenDialogDonation = ref(false);
</script>
<template>
  <div v-if="isLoading" class="card absolute inset-0 bg-white/50 flex items-center justify-center z-10">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else class="card">
    <div class="mb-4">
      <h3>Visualizar Donante</h3>
    </div>
    <DonorStatusCard
      :document-number="donor.documentNumber"
      :status="donor.status"
      :deferral-end-date="donor.deferralEndDate"
      :deferral-reason="donor.deferralReason"
      :gender="donor.gender"
      :required-advertisement="lastDonationDateDetail?.requiredAdvertisement || false"
      :last-donation-date="lastDonationDateDetail?.dateDonation || null"
      :date-enabled="lastDonationDateDetail?.dateEnabledDonation || null"
    />

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
        <Button v-if="!necesitaAdvertencia && actuadlDonationId == null" label="Nueva Donación" icon="pi pi-plus" class="h-8 p-button-success" @click="() => (isOpenDialogDonation = true)" />
      </div>

      <!-- Tabla de donaciones -->
      <div class="w-full">
        <DataTable
          :value="donationStore.donationsByDonor"
          tableStyle="min-width: 50rem"
          paginator
          :rows="10"
          :totalRecords="donationStore.totalRecordsDonationsByDonor"
          lazy
          :loading="loading"
          showGridlines
          :currentPageReportTemplate="'{currentPage} de {totalPages}'"
        >
          <template #empty>
            <p class="text-gray-600 text-lg py-4">No encontramos donaciones para este donante.</p>
          </template>

          <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :style="`width: ${col.width}`"> </Column>
          <Column header="Acciones">
            <template #body="{ data }">
              <div class="flex flex-wrap w-full">
                <Button class="h-8 w-[6rem] mr-1 my-1 btn-view" label="Visualizar" @click="goViewDonation(data.id)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <Dialog header="Nueva Donación" v-model:visible="isOpenDialogDonation" modal :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <DonationForm :donor="donor" @success="succesNewDoantion" @cancel="() => (isOpenDialogDonation = false)" />
    </Dialog>
  </div>
</template>
