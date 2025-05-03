<script setup>
import { documentTypesDonorOptions } from '@/enums/DocumentTypes';
import { useDonationStore } from '@/stores/donation/donations';
import { required } from '@/validation/validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const loading = ref(false);
const router = useRouter();
const donationStore = useDonationStore();

const errorMessageNotFoundDonor = ref(false);
const errorMessageNotFoundByDonor = ref(false);
const errorMessageNotCanViewByDonor = ref(false);

const errorMessageNotFound = ref(false);
const errorMessageNotCanView = ref(false);

const donor = reactive({
  documentType: '',
  documentNumber: ''
});

const rules = computed(() => ({
  documentType: { required: required('Tipo de documento') },
  documentNumber: { required: required('Número de documento') }
}));

const v$ = useVuelidate(rules, donor);

const donation = reactive({
  donationCode: ''
});

const rulesCode = computed(() => ({
  donationCode: { required: required('Código de donación') }
}));

const v2$ = useVuelidate(rulesCode, donation);

const setFalseMessages = () => {
  errorMessageNotFoundDonor.value = false;
  errorMessageNotFoundByDonor.value = false;
  errorMessageNotCanViewByDonor.value = false;
  errorMessageNotFound.value = false;
  errorMessageNotCanView.value = false;
};

const resetFilters = () => {
  donor.documentNumber = '';
  donor.documentType = '';
  v$.value.$reset();
};

const resetCode = () => {
  donation.donationCode = '';
  v2$.value.$reset();
};

const searchDonationByDonor = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  loading.value = true;
  setFalseMessages();
  const response = await donationStore.verifyDonationByDonor(donor.documentNumber, donor.documentType);
  if (!response.existDonor) {
    errorMessageNotFoundDonor.value = true;
    loading.value = false;
    return;
  }
  if (!response.donationActualExists) {
    errorMessageNotFoundByDonor.value = true;
    loading.value = false;
    return;
  }
  if (!response.canViewDonation) {
    errorMessageNotCanViewByDonor.value = true;
    loading.value = false;
    return;
  }
  router.push({
    path: '/donation/view',
    query: { donationId: response.donationId }
  });
  loading.value = false;
};
const searchDonationByCode = async () => {
  const isValid = await v2$.value.$validate();
  if (!isValid) return;

  loading.value = true;
  setFalseMessages();
  const response = await donationStore.verifyDonationByCode(donation.donationCode);
  if (!response.donationActualExists) {
    errorMessageNotFound.value = true;
    loading.value = false;
    return;
  }
  if (!response.canViewDonation) {
    errorMessageNotCanView.value = true;
    loading.value = false;
    return;
  }
  router.push({
    path: '/donation/view',
    query: { donationId: response.donationId }
  });
  loading.value = false;
};
watch(
  () => donor.documentNumber,
  () => {
    setFalseMessages();
  }
);
watch(
  () => donation.donationCode,
  () => {
    setFalseMessages();
  }
);
</script>
<template>
  <div class="card">
    <h3>Consultar Donación</h3>
    <BlockUI :blocked="loading">
      <Fieldset legend="Consultar donación por documento de donante">
        <div class="grid grid-cols-1 gap-6 max-w-3xl mx-auto px-4">
          <div class="w-full flex bg-red-50 text-red-600 p-3 rounded-md mb-1 items-center justify-center">
            <i class="pi pi-exclamation-triangle mr-2 mt-0.5 text-lg"></i>
            <span>Al buscar por documento de donante se mostrará la donación en proceso actualmente</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="text-left md:col-span-3 md:col-start-2 md:text-right">
              <label for="tipo_documento" class="text-gray-700">Tipo de Documento:</label>
            </div>
            <div class="md:col-span-5">
              <FloatLabel variant="on">
                <Select id="documentType" v-model="donor.documentType" :options="documentTypesDonorOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.documentType?.$error" />
                <label for="documentType">Tipo Documento</label>
              </FloatLabel>
              <Message v-if="v$.documentType?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.documentType.$errors[0].$message }}</Message>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="text-left md:col-span-3 md:col-start-2 md:text-right">
              <label for="nro_documento" class="text-gray-700">Número de documento:</label>
            </div>
            <div class="md:col-span-5">
              <FloatLabel variant="on">
                <InputText id="documentNumber" v-model="donor.documentNumber" aria-describedby="documentNumber" class="w-full" :invalid="v$.documentNumber?.$error" />
                <label for="documentNumber">Nro Documento</label>
              </FloatLabel>
              <Message v-if="v$.documentNumber?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.documentNumber.$errors[0].$message }}</Message>
            </div>
          </div>
          <!-- Mensaje si no se encuentra el donante -->
          <div v-if="errorMessageNotFoundDonor" class="text-red-600 mt-2 text-center">No se encontró ningún donante con el documento ingresado.</div>
          <div v-if="errorMessageNotFoundByDonor" class="text-red-600 mt-2 text-center">No se encontró ningúna donación en proceso para el donante ingresado.</div>
          <div v-if="errorMessageNotCanViewByDonor" class="text-red-600 mt-2 text-center">No puedes consultar la donación porque pertenece a otro banco de sangre.</div>
          <div class="flex justify-center gap-4 mt-4">
            <Button class="h-8 w-40 btn-clean" label="Limpiar" @click="resetFilters()" />
            <Button class="h-8 w-40" label="Buscar" severity="info" @click="searchDonationByDonor()" />
          </div>
        </div>

        <!-- Spinner sobre el contenido -->
        <div v-if="loading" class="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <ProgressSpinner style="width: 50px; height: 50px" />
        </div>
      </Fieldset>

      <Fieldset legend="Consultar donación por código de donación">
        <div class="grid grid-cols-1 gap-6 max-w-3xl mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mt-2">
            <div class="text-left md:col-span-3 md:col-start-2 md:text-right">
              <label for="nro_documento" class="text-gray-700">Código de donación:</label>
            </div>
            <div class="md:col-span-5">
              <FloatLabel variant="on">
                <InputText id="donationCode" v-model="donation.donationCode" aria-describedby="donationCode" class="w-full" :invalid="v2$.donationCode?.$error" />
                <label for="donationCode">Código de donación</label>
              </FloatLabel>
              <Message v-if="v2$.donationCode?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v2$.donationCode.$errors[0].$message }}</Message>
            </div>
          </div>
          <!-- Mensaje si no se encuentra la donación -->
          <div v-if="errorMessageNotFound" class="text-red-600 mt-2 text-center">No se encontró ninguna donación con el codigo ingresado.</div>
          <div v-if="errorMessageNotCanView" class="text-red-600 mt-2 text-center">No puedes consultar la donación porque pertenece a otro banco de sangre.</div>
          <div class="flex justify-center gap-4 mt-4">
            <Button class="h-8 w-40 btn-clean" label="Limpiar" @click="resetCode()" />
            <Button class="h-8 w-40" label="Buscar" severity="info" @click="searchDonationByCode()" />
          </div>
        </div>

        <!-- Spinner sobre el contenido -->
        <div v-if="loading" class="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <ProgressSpinner style="width: 50px; height: 50px" />
        </div>
      </Fieldset>
    </BlockUI>
  </div>
</template>
