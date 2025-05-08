<script setup>
import { documentTypesPatientOptions } from '@/enums/DocumentTypes';
import { usePatientStore } from '@/stores/transfusion/patient';
import { required } from '@/validation/validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const loading = ref(false);
const router = useRouter();
const errorMessage = ref(false);
const patientStore = usePatientStore();
const patient = reactive({
  documentType: '',
  documentNumber: ''
});

const rules = computed(() => ({
  documentType: { required: required('Tipo de documento') },
  documentNumber: { required: required('Número de documento') }
}));

const v$ = useVuelidate(rules, patient);

const resetFilters = () => {
  patient.documentNumber = '';
  patient.documentType = '';
  v$.value.$reset();
};

const searchPatient = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  loading.value = true;
  errorMessage.value = false;
  const response = await patientStore.verifyPatient(patient.documentNumber, patient.documentType);
  if (!response) {
    router.push(`/transfusion/patient/${patient.documentType}/${patient.documentNumber}`);
  } else {
    errorMessage.value = true;
  }
  loading.value = false;
};
watch(
  () => patient.documentNumber,
  () => {
    errorMessage.value = false;
  }
);
</script>
<template>
  <div class="card">
    <h3>Consultar Paciente</h3>
    <BlockUI :blocked="loading">
      <div class="grid grid-cols-1 gap-6 max-w-3xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div class="text-left md:col-span-3 md:col-start-2 md:text-right">
            <label for="tipo_documento" class="text-gray-700">Tipo de Documento:</label>
          </div>
          <div class="md:col-span-5">
            <FloatLabel variant="on">
              <Select id="documentType" v-model="patient.documentType" :options="documentTypesPatientOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.documentType?.$error" />
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
              <InputText id="documentNumber" v-model="patient.documentNumber" aria-describedby="documentNumber" class="w-full" :invalid="v$.documentNumber?.$error" />
              <label for="documentNumber">Nro Documento</label>
            </FloatLabel>
            <Message v-if="v$.documentNumber?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.documentNumber.$errors[0].$message }}</Message>
          </div>
        </div>
        <!-- Mensaje si no se encuentra el paciente -->
        <div v-if="errorMessage" class="text-red-600 mt-2 text-center">No se encontró ningún paciente registrado con el tipo y número de documento.</div>

        <div class="flex justify-center gap-4 mt-4">
          <Button class="h-8 w-40 btn-clean" label="Limpiar" @click="resetFilters()" />
          <Button class="h-8 w-40" label="Buscar" severity="info" @click="searchPatient()" />
        </div>
      </div>

      <!-- Spinner sobre el contenido -->
      <div v-if="loading" class="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
        <ProgressSpinner style="width: 50px; height: 50px" />
      </div>
    </BlockUI>
  </div>
</template>
