<script setup>
import UnitTable from '@/components/unit/UnitTable.vue';
import { bloodGroupOptions, rhFactorOptions } from '@/enums/BloodType';
import { documentTypesPatientOptions } from '@/enums/DocumentTypes';
import userService from '@/services/admin/users';
import { usePatientStore } from '@/stores/transfusion/patient';
import { useTransfusionStore } from '@/stores/transfusion/transfusions';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { minLength } from '@vuelidate/validators';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const isLoading = ref(true);
const isNewTransfusion = ref(true);
const patientStore = usePatientStore();
const transfusionStore = useTransfusionStore();
const router = useRouter();

// const priorityOptions = [];

const medicUsersRequest = ref([]);
const getMedicRequestOptions = async (bloodBankId) => {
  try {
    const response = await userService.getUserRequestByBloodBank(bloodBankId);
    medicUsersRequest.value = response || [];
  } catch (error) {
    console.error('Error obteniendo variables:', error);
  }
};

const transfusion = reactive({
  patientDocumentType: null,
  patientDocumentNumber: null,
  patientName: null,
  patientBloodType: null,
  patientRhFactor: null,
  attendingDoctor: '',
  bed: '',
  medicalService: '',
  // priority: '',
  hasCrossmatch: '',
  diagnosis: '',
  requestReason: '',
  request: []
});

const patientFound = ref(false);
const searchPatient = async () => {
  try {
    const response = await patientStore.getPatient(transfusion.patientDocumentNumber, transfusion.patientDocumentType);
    if (response == null) return;
    patientFound.value = true;
    transfusion.patientName = `${response.firstName} ${response.lastName} ${response.secondLastName}`;
    transfusion.patientBloodType = response.bloodType;
    transfusion.patientRhFactor = response.rhFactor;
  } catch (err) {
    patientFound.value = false;
    console.error(err);
  }
};

const addRequestedUnit = async (unit) => {
  const newUnit = {
    id: transfusion.request.length + 1,
    unitType: unit.unitType,
    requestedQuantity: unit.requestedQuantity
  };
  transfusion.request.push(newUnit);
};

const editRequestedUnit = async (index, updatedUnit) => {
  transfusion.request[index] = {
    ...transfusion.request[index],
    unitType: updatedUnit.unitType,
    requestedQuantity: updatedUnit.requestedQuantity
  };
};
const removeRequestedUnit = async (index) => {
  transfusion.request.splice(index, 1);
};

const rules = computed(() => ({
  patientDocumentType: { required: required('Tipo de documento') },
  patientDocumentNumber: { required: required('Número de documento') },
  attendingDoctor: { required: required('Médico') },
  bed: { required: required('Cama') },
  medicalService: { required: required('Servicio') },
  // priority: { required: required('Prioridad') },
  hasCrossmatch: { required: required('Pruebas cruzadas') },
  diagnosis: { required: required('Diagnostico') },
  requestReason: { required: required('Motivo') },
  request: {
    required: required('Unidades solicitadas'),
    minLength: minLength(1)
  }
}));

const v$ = useVuelidate(rules, transfusion);

const route = useRoute();

onMounted(async () => {
  isLoading.value = true;
  await getMedicRequestOptions();
  const transfusionId = route.params.id;
  if (transfusionId) {
    isNewTransfusion.value = false;
    const response = await transfusionStore.getTranfusionAllInfo(transfusionId);

    Object.assign(transfusion, response.transfusion);
    transfusion.request = response.request || [];
    patientFound.value = true;
    if (medicUsersRequest.value.length === 0) {
      const fallbackDoctor = { id: 0, fullName: response.transfusion.attendingDoctorName };
      medicUsersRequest.value.push(fallbackDoctor);
      transfusion.attendingDoctor = fallbackDoctor.id;
    } else {
      transfusion.attendingDoctor = medicUsersRequest.value.find((t) => t.fullName === response.transfusion.attendingDoctorName)?.id;
    }
  }
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
    <h3>Solicitud de transfusión</h3>
    <Fieldset legend="Datos generales">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div class="flex">
            <div class="flex justify-center items-center">
              <h6 class="block mb-1 mr-4">Paciente</h6>
            </div>
            <span class="w-full mr-2">
              <FloatLabel variant="on">
                <Select
                  id="patientDocumentType"
                  v-model="transfusion.patientDocumentType"
                  :options="documentTypesPatientOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full"
                  :invalid="v$.patientDocumentType?.$error"
                  :disabled="!isNewTransfusion"
                />
                <label for="patientDocumentType">Tipo Documento</label>
              </FloatLabel>
              <Message v-if="v$.patientDocumentType?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.patientDocumentType.$errors[0].$message }}</Message>
            </span>
          </div>
        </div>
        <div>
          <div class="flex">
            <span class="w-full mr-2">
              <InputGroup>
                <FloatLabel variant="on" class="w-full">
                  <InputText
                    id="patientDocumentNumber"
                    v-model="transfusion.patientDocumentNumber"
                    aria-describedby="documentNumber"
                    :disabled="!transfusion.patientDocumentType"
                    @focusout="searchPatient"
                    :invalid="v$.patientDocumentNumber?.$error"
                  />
                  <label for="patientDocumentNumber">Nro Documento</label>
                </FloatLabel>
                <InputGroupAddon><Button icon="pi pi-search" severity="secondary" variant="text" @click="searchPatient" /></InputGroupAddon>
              </InputGroup>
              <Message v-if="v$.patientDocumentNumber?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.patientDocumentNumber.$errors[0].$message }}</Message>
              <Message v-if="patientFound === true" severity="success" size="small" variant="simple" class="pt-1">Paciente encontrado</Message>
              <Message v-else-if="patientFound === false" severity="error" size="small" variant="simple" class="pt-1">Paciente no encontrado</Message>
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <InputText id="patientName" v-model="transfusion.patientName" class="w-full" disabled />
            <label for="patientName">Nombres del paciente</label>
          </FloatLabel>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <Select id="bloodType" v-model="transfusion.patientBloodType" :options="bloodGroupOptions" optionLabel="label" optionValue="value" class="w-full" disabled />
            <label for="bloodType">Grupo sanguíneo</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel variant="on">
            <Select id="rhFactor" v-model="transfusion.patientRhFactor" :options="rhFactorOptions" optionLabel="label" optionValue="value" class="w-full" disabled />
            <label for="rhFactor">Rh factor</label>
          </FloatLabel>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h6 class="mb-2">Médico solicitante</h6>
          <FloatLabel variant="on">
            <Select id="doctor_request" v-model="transfusion.attendingDoctor" :options="medicUsersRequest" optionLabel="fullName" optionValue="id" class="w-full" :invalid="v$.attendingDoctor?.$error" />
            <label for="doctor_request">Médico</label>
          </FloatLabel>
          <Message v-if="v$.attendingDoctor?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.attendingDoctor.$errors[0].$message }}</Message>
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
            <InputText id="medicalService" v-model="transfusion.medicalService" class="w-full" :invalid="v$.medicalService?.$error" />
            <label for="medicalService">Servicio</label>
          </FloatLabel>
          <Message v-if="v$.medicalService?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.medicalService.$errors[0].$message }}</Message>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <!-- <div>
          <FloatLabel variant="on">
            <Select id="id_priority" v-model="transfusion.priority" :options="priorityOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.priority?.$error" />
            <label for="id_priority">Prioridad</label>
          </FloatLabel>
          <Message v-if="v$.priority?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.priority.$errors[0].$message }}</Message>
        </div> -->
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
            <RadioButton :inputId="`tests-${index}`" :value="option.value" v-model="transfusion.hasCrossmatch" name="tests" :invalid="v$.hasCrossmatch?.$error" />
            <label :for="`tests-${index}`">{{ option.label }}</label>
          </div>
          <Message v-if="v$.hasCrossmatch?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.hasCrossmatch.$errors[0].$message }}</Message>
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
          <Textarea id="requestReason" v-model="transfusion.requestReason" rows="5" class="w-full resize-none" :invalid="v$.requestReason?.$error" />
          <label for="requestReason">Motivo</label>
        </FloatLabel>
        <Message v-if="v$.requestReason?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.requestReason.$errors[0].$message }}</Message>
      </div>
    </Fieldset>

    <UnitTable
      title="Unidades solicitadas"
      type="singleData"
      type-modal="request"
      :loading="isLoading"
      v-model="transfusion.request"
      @edit="(index, unit) => editRequestedUnit(index, unit)"
      @add="(unit) => addRequestedUnit(unit)"
      @remove="(unit) => removeRequestedUnit(unit)"
    />
    <Message v-if="v$.request?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.request.$errors[0].$message }}</Message>

    <div class="flex justify-end mt-4 gap-2">
      <Button class="min-w-40 btn-clean" label="Cancelar" @click="cancel" />
      <Button class="min-w-40 p-button-success" label="Guardar" type="submit" />
    </div>
  </form>
</template>
