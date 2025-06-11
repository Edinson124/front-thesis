<script setup>
import DonationForm from '@/components/donation/DonationForm.vue';
import InfoPatient from '@/components/transfusion/InfoPatient.vue';
import { usePatientStore } from '@/stores/transfusion/patient';
import { useTransfusionStore } from '@/stores/transfusion/transfusions';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();

const isOpenDialogDonation = ref(false);
const patientStore = usePatientStore();
const transfusionStore = useTransfusionStore();
const loading = ref(false);
const route = useRoute();

const patient = reactive({
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
  allergic: ''
});

const columns = [
  { field: 'id', header: 'Código', width: '12%' },
  { field: 'bloodBankName', header: 'Banco de sangre', width: '30%' },
  { field: 'date', header: 'Fecha de transfusión', width: '20%' },
  { field: 'status', header: 'Estado', width: '12%' }
];

function visualizarTranfusion(transfusion) {
  console.log(transfusion);
  router.push({
    path: '/transfusion/view',
    query: { transfusionId: transfusion.id }
  });
}

onMounted(async () => {
  const documentNumber = route.params.doc;
  const documentType = route.params.type;
  // await transfusionStore.getTransfusionsByDocumentPatient(documentNumber, documentType);
  // const patientReponse = await patientStore.getPatient(documentNumber, documentType);

  const [, patientReponse] = await Promise.all([transfusionStore.getTransfusionsByDocumentPatient(documentNumber, documentType), patientStore.getPatient(documentNumber, documentType)]);

  Object.assign(patient, { ...patient, ...patientReponse });
});
</script>
<template>
  <div class="card">
    <div class="mb-4">
      <h3>Visualizar Pacientes</h3>
    </div>
    <!-- Datos generales del paciente -->
    <Fieldset legend="Datos generales del paciente" class="!mb-4">
      <div class="rounded-md px-5 pt-5 pb-2 bg-white">
        <InfoPatient :patient="patient" :isEditable="true" />
      </div>
    </Fieldset>

    <!-- Sección de Tranfusiones -->
    <div>
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl">Tranfusiones</h2>
      </div>

      <!-- Tabla de Tranfusiones -->
      <div class="w-full">
        <DataTable
          :value="transfusionStore.tranfusionByPatient"
          tableStyle="min-width: 50rem"
          paginator
          :rows="10"
          :totalRecords="transfusionStore.totalRecordsTranfusionByPatient"
          lazy
          :loading="loading"
          showGridlines
          :currentPageReportTemplate="'{currentPage} de {totalPages}'"
        >
          <template #empty>
            <p class="text-gray-600 text-lg py-4">No encontramos transfusiones para este paciente.</p>
          </template>

          <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :style="`width: ${col.width}`"> </Column>
          <Column header="Acciones">
            <template #body="slotProps">
              <div class="flex flex-wrap w-full">
                <Button class="h-8 w-[6rem] mr-1 my-1 btn-view" label="Visualizar" @click="visualizarTranfusion(slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <Dialog v-model:visible="isOpenDialogDonation" modal :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <DonationForm :donor="donor" @success="() => (isOpenDialogDonation = false)" @cancel="() => (isOpenDialogDonation = false)" />
    </Dialog>
  </div>
</template>
