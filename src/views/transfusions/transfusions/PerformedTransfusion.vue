<script setup>
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { RhFactor } from '@/enums/BloodType';
import { useTransfusionResultStore } from '@/stores/transfusion/transfusionResult';
import { useTransfusionStore } from '@/stores/transfusion/transfusions';
import { required, requiredIf } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const tranfusionStore = useTransfusionStore();
const tranfusionResultStore = useTransfusionResultStore();

const showConfirmModal = ref(false);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const showCancelConfirmDialog = ref(false);

const transfusionId = computed(() => route.query.transfusionId);
const transfusionResult = reactive({
  codeTransfusion: '',
  bloodType: '',
  patientName: '',
  medicName: ''
});
const transfusionPerformed = reactive({
  transfusionDate: null,
  transfusionDoctorLicenseNumber: '',
  transfusionDoctorName: '',
  hasReaction: 'false',
  reactionAdverse: null,
  observations: null
});

const rules = computed(() => ({
  transfusionDate: { required: required('Fecha y hora de transfusión') },
  transfusionDoctorLicenseNumber: { required: required('Número de colegiatura') },
  transfusionDoctorName: { required: required('Nombre del médico') },
  hasReaction: { required: required('Tiene reacción') },
  reactionAdverse: {
    required: requiredIf('Reacción adversa', () => transfusionPerformed.hasReaction === 'true')
  }
}));

const v$ = useVuelidate(rules, transfusionPerformed);

const saveResult = async () => {
  const response = await tranfusionResultStore.newTransfusionResult(transfusionId.value, transfusionPerformed);
  if (response) {
    showConfirmModal.value = false;
    showSuccessModal.value = true;
  } else {
    showErrorModal.value = true;
  }
};

const handleSave = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;
  showConfirmModal.value = true;
};
watch(transfusionId, (newVal) => {
  if (newVal) {
    console.log(newVal);
    transfusionResult.codeTransfusion = newVal;
  }
});
const cancel = () => {
  showCancelConfirmDialog.value = true;
};

onMounted(async () => {
  const id = route.query.transfusionId;
  if (id) {
    transfusionResult.codeTransfusion = id;
  }
  const response = await tranfusionStore.getTranfusionDetail(id);
  if (response) {
    transfusionResult.bloodType = `${response.patientBloodType}${RhFactor[response.patientRhFactor]?.symbol || ''}`;
    transfusionResult.patientName = response.patientName;
    transfusionResult.medicName = response.attendingDoctorName;
  }
});
</script>

<template>
  <div class="card">
    <h2>Resultado de la transfusión</h2>
    <Fieldset legend="Datos generales" class="mb-4">
      <div class="rounded-md px-5 pt-2 pb-2 bg-white">
        <div class="space-y-4">
          <!-- Código de solicitud -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <div class="md:col-span-2 font-medium">Código de solicitud:</div>
            <div class="md:col-span-4 flex">
              <div class="flex-grow mr-2">
                <FloatLabel variant="on">
                  <InputText v-model="transfusionResult.codeTransfusion" id="codeTransfusion" disabled class="w-full p-inputwrapper-filled" />
                  <label for="codeTransfusion">Código de solicitud</label>
                </FloatLabel>
              </div>
            </div>
          </div>

          <!-- Nombres del médico solicitante -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div class="col-span-11">
              <FloatLabel variant="on">
                <InputText id="medicName" v-model="transfusionResult.medicName" disabled class="w-full p-inputwrapper-filled" />
                <label for="medicName">Nombres del médico solicitante</label>
              </FloatLabel>
            </div>
          </div>

          <!-- Nombres del paciente -->
          <div class="grid col-span-10 grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <!-- Grupo sanguíneo -->
            <div class="md:col-span-3">
              <FloatLabel variant="on">
                <InputText id="bloodType" v-model="transfusionResult.bloodType" disabled class="w-full p-inputwrapper-filled" />
                <label for="bloodType">Grupo sanguíneo</label>
              </FloatLabel>
            </div>

            <div class="md:col-span-8">
              <FloatLabel variant="on">
                <InputText id="patientName" v-model="transfusionResult.patientName" disabled class="w-full p-inputwrapper-filled" />
                <label for="patientName">Nombres del paciente</label>
              </FloatLabel>
            </div>
          </div>

          <!-- Fecha de transfusión -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div class="col-span-5">
              <FloatLabel variant="on">
                <DatePicker v-model="transfusionPerformed.transfusionDate" dateFormat="dd/mm/yy" showTime hourFormat="24" fluid showIcon id="transfusionDate" class="w-full" :invalid="v$.transfusionDate?.$error" />
                <label for="transfusionDate">Fecha y hora de transfusión</label>
              </FloatLabel>
              <Message v-if="v$.transfusionDate?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.transfusionDate.$errors[0].$message }}</Message>
            </div>
          </div>

          <div>Médico transfusional:</div>
          <!-- Médico transfusional -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <div class="md:col-span-3">
              <div class="flex-grow mr-2">
                <FloatLabel variant="on">
                  <InputText v-model="transfusionPerformed.transfusionDoctorLicenseNumber" id="transfusionDoctorLicenseNumber" class="w-full" :invalid="v$.transfusionDoctorLicenseNumber?.$error" />
                  <label for="transfusionDoctorLicenseNumber">Nro Colegiatura</label>
                </FloatLabel>
                <Message v-if="v$.transfusionDoctorLicenseNumber?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.transfusionDoctorLicenseNumber.$errors[0].$message }}</Message>
              </div>
            </div>
            <div class="md:col-span-8">
              <FloatLabel variant="on">
                <InputText v-model="transfusionPerformed.transfusionDoctorName" id="transfusionDoctorName" class="w-full" :invalid="v$.transfusionDoctorName?.$error" />
                <label for="transfusionDoctorName">Nombre del médico</label>
              </FloatLabel>
              <Message v-if="v$.transfusionDoctorName?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.transfusionDoctorName.$errors[0].$message }}</Message>
            </div>
          </div>

          <!-- Reacción adversa -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <div class="md:col-span-3 font-medium">Reacción adversa</div>
            <div class="md:col-span-9 flex gap-4">
              <div class="flex items-center">
                <RadioButton v-model="transfusionPerformed.hasReaction" inputId="reaccion_si" name="reaccion" value="true" />
                <label for="reaccion_si" class="ml-2">Si</label>
              </div>
              <div class="flex items-center">
                <RadioButton v-model="transfusionPerformed.hasReaction" inputId="reaccion_no" name="reaccion" value="false" />
                <label for="reaccion_no" class="ml-2">No</label>
              </div>
            </div>
          </div>

          <!-- Detalle de reacción adversa -->
          <div>
            <FloatLabel variant="on">
              <Textarea v-model="transfusionPerformed.reactionAdverse" id="reactionAdverse" rows="3" class="w-full resize-none" :disabled="transfusionPerformed.hasReaction !== 'true'" :invalid="v$.reactionAdverse?.$error" />
              <label for="reactionAdverse">Reacción adversa</label>
            </FloatLabel>
            <Message v-if="v$.reactionAdverse?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.reactionAdverse.$errors[0].$message }}</Message>
          </div>

          <!-- Observaciones -->
          <div>
            <FloatLabel variant="on">
              <Textarea v-model="transfusionPerformed.observations" id="observations" rows="3" class="w-full resize-none" />
              <label for="observations">Observaciones</label>
            </FloatLabel>
          </div>
        </div>
      </div>
    </Fieldset>

    <div class="flex justify-end px-8 my-8 gap-4">
      <Button class="h-10 w-full md:max-w-[16rem] btn-clean" label="Cancelar" @click="cancel" />
      <Button class="h-10 w-full md:max-w-[16rem]" label="Guardar" severity="success" @click="handleSave" />
    </div>
  </div>
  <ConfirmModal id="showConfirmSaveModal" v-model="showConfirmModal" header="¿Estás seguro de guardar resultado de transfusión?" accept-text="Guardar" @accept="saveResult" />
  <SuccessModal id="showSuccessSaveModal" v-model="showSuccessModal" message="El resultado de la transfusión fue guardada con éxito" @close="() => router.back()" />
  <ErrorModal id="showErrorSaveModal" v-model="showErrorModal" />

  <ConfirmModal id="cancelConfirmDialog" v-model="showCancelConfirmDialog" header="¿Estás seguro de que desea cancelar la operación?" accept-text="Sí" accept-button-class="p-button-danger" @accept="() => router.back()" reject-text="No" />
</template>
