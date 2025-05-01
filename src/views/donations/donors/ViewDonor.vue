<script setup>
import { useDonationStore } from '@/stores/donations/donations';
import { useDonorStore } from '@/stores/donations/donor';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
const donorStore = useDonorStore();
const donationStore = useDonationStore();
const loading = ref(false);
const route = useRoute();
const years = ref(null);
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
  status: '',
  trips: ''
});

const columns = [
  { field: 'id', header: 'Código', width: '12%' },
  { field: 'bloodBankName', header: 'Banco de sangre', width: '30%' },
  { field: 'date', header: 'Fecha de donación', width: '20%' },
  { field: 'status', header: 'Estado', width: '12%' }
];

function calculateAge(birthDate) {
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += lastDayOfMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}
function stringToDate(fechaString) {
  const partes = fechaString.split('/');
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1;
  const anio = parseInt(partes[2], 10);

  return new Date(anio, mes, dia);
}
const getStringFormatAge = (birthDate) => {
  if (!birthDate) return '';
  const age = calculateAge(birthDate);
  return `${age.years} años ${age.months} meses ${age.days} días`;
};
onMounted(async () => {
  const documentNumber = route.params.doc;
  const documentType = route.params.type;
  await donationStore.getDonationsByDocumentDonor(documentNumber, documentType);
  const donorResponse = await donorStore.getDonor(documentNumber, documentType);
  Object.assign(donor, { ...donor, ...donorResponse });
  years.value = getStringFormatAge(stringToDate(donor.birthDate));
});
</script>
<template>
  <div class="card">
    <div class="mb-4">
      <h3>Visualizar Donante</h3>
    </div>
    <div class="bg-green-500 text-white p-4 rounded-md mb-4 flex items-center">
      <div class="mr-2 mt-1">
        <i class="mdi mdi-check-circle text-3xl inline-block"></i>
      </div>
      <div>
        <div class="font-semibold text-lg">Documento del donante: {{ donor.documentNumber }}</div>
        <div class="font-semibold text-lg">Estado del donante: {{ donor.status }}</div>
      </div>
    </div>

    <!-- Datos generales del donante -->
    <Fieldset legend="Datos generales del donante" class="!mb-4">
      <div class="rounded-md px-5 pt-5 pb-2 bg-white">
        <div>
          <div>
            <div class="mb-2"><span class="font-medium">Identificación: </span> {{ donor.documentType }} - {{ donor.documentNumber }}</div>
            <div>
              <div class="mb-2"><span class="font-medium">Nombres y Apellidos: </span> {{ donor.firstName }} {{ donor.lastName }} {{ donor.secondLastName }}</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-11 md:gap-y-3 gap-x-6">
              <div class="mb-2 md:col-span-7"><span class="font-medium">Fecha de nacimiento: </span> {{ donor.birthDate }} - {{ years }}</div>
              <div class="mb-2 md:col-span-4"><span class="font-medium">Sexo: </span> {{ donor.gender }}</div>
            </div>
            <div>
              <div class="mb-2"><span class="font-medium">Domicilio: </span> {{ donor.address }} - {{ donor.region }} - {{ donor.province }} - {{ donor.district }}</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-11 md:gap-y-3 gap-x-6">
              <div class="mb-2 md:col-span-7"><span class="font-medium">Ocupación: </span> {{ donor.occupation || '-' }}</div>
              <div class="mb-2 md:col-span-4"><span class="font-medium">Estado civil: </span> {{ donor.maritalStatus || '-' }}</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-11 md:gap-y-3 gap-x-6">
              <div class="mb-2 md:col-span-7"><span class="font-medium">Email: </span> {{ donor.email || '-' }}</div>
              <div class="mb-2 md:col-span-4"><span class="font-medium">Teléfono: </span> {{ donor.phone || '-' }}</div>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <Button label="Editar" class="h-8 w-[6rem] btn-edit" />
        </div>
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
