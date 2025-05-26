<script setup>
import UnitTable from '@/components/unit/UnitTable.vue';
import { bloodGroupOptions } from '@/enums/BloodType';
import { documentTypesPatientOptions } from '@/enums/DocumentTypes';
import { usePatientStore } from '@/stores/transfusion/patient';
import { useTransfusionStore } from '@/stores/transfusion/transfusions';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { minLength } from '@vuelidate/validators';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const isLoading = ref(true);
const patientStore = usePatientStore();
const transfusionStore = useTransfusionStore();
const router = useRouter();

const priorityOptions = [];

const transfusion = reactive({
  patient: {
    documentType: '',
    documentNumber: '',
    names: '',
    bloodGroup: ''
  },
  doctorRequest: '',
  bed: '',
  service: '',
  priority: '',
  crossTests: '',
  diagnosis: '',
  reason: '',
  requestedUnits: []
});

const patientFound = ref(false);
const searchPatient = async () => {
  try {
    const response = await patientStore.getPatient(transfusion.patient.documentNumber, transfusion.patient.documentType);
    patientFound.value = true;
    transfusion.patient.names = `${response.firstName} ${response.lastName}`;
    // transfusion.patient.bloodGroup = response.bloodGroup;
  } catch (err) {
    patientFound.value = false;
    console.error(err);
  }
};

const addRequestedUnit = async (unit) => {
  transfusion.requestedUnits.push({ id: transfusion.requestedUnits.length + 1, ...unit });
};
const editRequestedUnit = async (index, updatedUnit) => {
  transfusion.requestedUnits[index] = { ...transfusion.requestedUnits[index], ...updatedUnit };
};
const removeRequestedUnit = async (index) => {
  transfusion.requestedUnits.splice(index, 1);
};

const rules = computed(() => ({
  patient: {
    documentType: { required: required('Tipo de documento') },
    documentNumber: { required: required('Número de documento') }
  },
  doctorRequest: { required: required('Médico') },
  bed: { required: required('Cama') },
  service: { required: required('Servicio') },
  priority: { required: required('Prioridad') },
  crossTests: { required: required('Pruebas cruzadas') },
  diagnosis: { required: required('Diagnostico') },
  reason: { required: required('Motivo') },
  requestedUnits: {
    required: required('Unidades solicitadas'),
    minLength: minLength(1)
  }
}));

const v$ = useVuelidate(rules, transfusion);

onMounted(() => {
  isLoading.value = false;
});

const saveTransfusion = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  const success = await transfusionStore.registerTransfusionRequest(transfusion);
  if (success) {
    router.back();
  }
};

const cancel = () => {
  router.back();
};
</script>
<template>
  <div v-if="isLoading" class="card absolute inset-0 bg-white/50 flex items-center justify-center z-10">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <form v-else class="card" @submit.prevent="saveTransfusion">
    <Fieldset legend="Datos generales">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div class="flex">
            <div class="flex justify-center items-center">
              <h6 class="block mb-1 mr-4">Paciente</h6>
            </div>
            <span class="w-full mr-2">
              <FloatLabel variant="on">
                <Select id="documentType" v-model="transfusion.patient.documentType" :options="documentTypesPatientOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.patient.documentType?.$error" />
                <label for="documentType">Tipo Documento</label>
              </FloatLabel>
              <Message v-if="v$.patient.documentType?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.patient.documentType.$errors[0].$message }}</Message>
            </span>
          </div>
        </div>
        <div>
          <div class="flex">
            <span class="w-full mr-2">
              <InputGroup>
                <FloatLabel variant="on" class="w-full">
                  <InputText id="documentNumber" v-model="transfusion.patient.documentNumber" aria-describedby="documentNumber" :disabled="!transfusion.patient.documentType" @focusout="searchPatient" :invalid="v$.patient.documentNumber?.$error" />
                  <label for="documentNumber">Nro Documento</label>
                </FloatLabel>
                <InputGroupAddon><Button icon="pi pi-search" severity="secondary" variant="text" @click="searchPatient" /></InputGroupAddon>
              </InputGroup>
              <Message v-if="v$.patient.documentNumber?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.patient.documentNumber.$errors[0].$message }}</Message>
              <Message v-if="patientFound === true" severity="success" size="small" variant="simple" class="pt-1">Paciente encontrado</Message>
              <Message v-else-if="patientFound === false" severity="error" size="small" variant="simple" class="pt-1">Paciente no encontrado</Message>
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <InputText id="names" v-model="transfusion.patient.names" class="w-full" disabled />
            <label for="names">Nombres del paciente</label>
          </FloatLabel>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <Select id="id_bloodGroup" v-model="transfusion.patient.bloodGroup" :options="bloodGroupOptions" optionLabel="label" optionValue="value" class="w-full" disabled />
            <label for="id_bloodGroup">Grupo sanguíneo</label>
          </FloatLabel>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <div>
          <h6 class="mb-2">Médico solicitante</h6>
          <FloatLabel variant="on">
            <Select id="doctor_request" v-model="transfusion.doctorRequest" :options="[]" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.doctorRequest?.$error" />
            <label for="doctor_request">Médico</label>
          </FloatLabel>
          <Message v-if="v$.doctorRequest?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.doctorRequest.$errors[0].$message }}</Message>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <InputText id="bed" v-model="transfusion.bed" class="w-full" :invalid="v$.bed?.$error" />
            <label for="bed">Cama</label>
          </FloatLabel>
          <Message v-if="v$.bed?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.bed.$errors[0].$message }}</Message>
        </div>
        <div>
          <FloatLabel variant="on">
            <InputText id="service" v-model="transfusion.service" class="w-full" :invalid="v$.service?.$error" />
            <label for="service">Servicio</label>
          </FloatLabel>
          <Message v-if="v$.service?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.service.$errors[0].$message }}</Message>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <Select id="id_priority" v-model="transfusion.priority" :options="priorityOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.priority?.$error" />
            <label for="id_priority">Prioridad</label>
          </FloatLabel>
          <Message v-if="v$.priority?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.priority.$errors[0].$message }}</Message>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <div class="flex items-center gap-8">
          <h6 class="m-0">Pruebas cruzadas:</h6>
          <div
            class="flex items-center gap-2"
            v-for="(option, index) in [
              { label: 'Si', value: true },
              { label: 'No', value: false }
            ]"
            :key="index"
          >
            <RadioButton :inputId="`tests-${index}`" :value="option.value" v-model="transfusion.crossTests" name="tests" :invalid="v$.crossTests?.$error" />
            <label :for="`tests-${index}`">{{ option.label }}</label>
          </div>
          <Message v-if="v$.crossTests?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.crossTests.$errors[0].$message }}</Message>
        </div>
      </div>

      <div class="mb-4">
        <FloatLabel variant="on">
          <Textarea id="diagnosis" v-model="transfusion.diagnosis" rows="5" class="w-full resize-none" :invalid="v$.diagnosis?.$error" />
          <label for="diagnosis">Diagnostico</label>
        </FloatLabel>
        <Message v-if="v$.diagnosis?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.diagnosis.$errors[0].$message }}</Message>
      </div>

      <div class="mb-4">
        <FloatLabel variant="on">
          <Textarea id="reason" v-model="transfusion.reason" rows="5" class="w-full resize-none" :invalid="v$.reason?.$error" />
          <label for="reason">Motivo</label>
        </FloatLabel>
        <Message v-if="v$.reason?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.reason.$errors[0].$message }}</Message>
      </div>
    </Fieldset>

    <UnitTable
      title="Unidades solicitadas"
      type="singleData"
      type-modal="request"
      :loading="isLoading"
      v-model="transfusion.requestedUnits"
      @edit="(index, unit) => editRequestedUnit(index, unit)"
      @add="(unit) => addRequestedUnit(unit)"
      @remove="(unit) => removeRequestedUnit(unit)"
    />
    <Message v-if="v$.requestedUnits?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.requestedUnits.$errors[0].$message }}</Message>

    <div class="flex justify-end mt-4 gap-2">
      <Button class="min-w-40 btn-clean" label="Cancelar" @click="cancel" />
      <Button class="min-w-40 p-button-success" label="Guardar" type="submit" />
    </div>
  </form>
</template>
