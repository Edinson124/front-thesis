<script setup>
import UnitTable from '@/components/unit/UnitTable.vue';
import { bloodGroupOptions } from '@/enums/BloodType';
import { documentTypesPatientOptions } from '@/enums/DocumentTypes';
import { usePatientStore } from '@/stores/transfusion/patient';
import { onMounted, reactive, ref } from 'vue';

const isLoading = ref(true);
const patientStore = usePatientStore();

const patient = reactive({
  documentType: '',
  documentNumber: '',
  names: '',
  bloodGroup: '',
  bed: '',
  service: '',
  tests: '',
  diagnosis: '',
  reason: ''
});

onMounted(() => {
  isLoading.value = true;
  console.log('0');
  isLoading.value = false;
});

const documentNumberVerified = ref(null);
const verifyDocumentNumber = async () => {
  const response = await patientStore.verifyPatient(patient.documentNumber, patient.documentType);
  documentNumberVerified.value = response;
};

const priorityOptions = [];
</script>
<template>
  <div v-if="isLoading" class="card absolute inset-0 bg-white/50 flex items-center justify-center z-10">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else class="card">
    <Panel header="Datos generales">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div class="flex">
            <div class="flex justify-center items-center">
              <label class="block mb-1 mr-4">Paciente:</label>
            </div>
            <span class="w-full mr-2">
              <FloatLabel variant="on">
                <Select id="documentType" v-model="patient.documentType" :options="documentTypesPatientOptions" optionLabel="label" optionValue="value" class="w-full" />
                <label for="documentType">Tipo Documento</label>
              </FloatLabel>
            </span>
          </div>
        </div>
        <div>
          <div class="flex">
            <span class="w-full mr-2">
              <InputGroup>
                <FloatLabel variant="on" class="w-full">
                  <InputText id="documentNumber" v-model="patient.documentNumber" aria-describedby="documentNumber" :disabled="!patient.documentType" @focusout="verifyDocumentNumber" />
                  <label for="documentNumber">Nro Documento</label>
                </FloatLabel>
                <InputGroupAddon><Button icon="pi pi-search" severity="secondary" variant="text" @click="verifyDocumentNumber" /></InputGroupAddon>
              </InputGroup>
              <Message v-if="documentNumberVerified === true" severity="success" size="small" variant="simple" class="pt-1">El documento ingresado está disponible</Message>
              <Message v-else-if="documentNumberVerified === false" severity="error" size="small" variant="simple" class="pt-1">El documento ingresado no está disponible</Message>
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <InputText id="names" v-model="patient.names" class="w-full" disabled />
            <label for="names">Nombres del paciente</label>
          </FloatLabel>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <Select id="id_bloodGroup" v-model="patient.bloodGroup" :options="bloodGroupOptions" optionLabel="label" optionValue="value" class="w-full" disabled />
            <label for="id_bloodGroup">Grupo sanguíneo</label>
          </FloatLabel>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <InputText id="bed" v-model="patient.bed" class="w-full" />
            <label for="bed">Cama</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel variant="on">
            <InputText id="service" v-model="patient.service" class="w-full" />
            <label for="service">Servicio</label>
          </FloatLabel>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <Select id="id_priority" v-model="patient.priority" :options="priorityOptions" optionLabel="label" optionValue="value" class="w-full" />
            <label for="id_priority">Prioridad</label>
          </FloatLabel>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            <RadioButton :inputId="`tests-${index}`" :value="option.value" v-model="patient.tests" name="tests" />
            <label :for="`tests-${index}`">{{ option.label }}</label>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <FloatLabel variant="on">
          <Textarea id="diagnosis" v-model="patient.diagnosis" rows="5" class="w-full resize-none" />
          <label for="diagnosis">Diagnostico</label>
        </FloatLabel>
      </div>

      <div class="mb-4">
        <FloatLabel variant="on">
          <Textarea id="reason" v-model="patient.reason" rows="5" class="w-full resize-none" />
          <label for="reason">Motivo</label>
        </FloatLabel>
      </div>
    </Panel>

    <UnitTable
      title="Unidades solicitadas"
      type="singleData"
      type-modal="request"
      :loading="isLoading"
      v-model="patientStore.unitsFromRequest"
      :totalUnits="patientStore.totalUnitsFromRequest"
      @edit="(index, unit) => patientStore.editUnitFromRequest(index, unit)"
      @add="(unit) => patientStore.addUnitFromRequest(unit)"
    />
  </div>
</template>
