<script setup>
import InfoTransfusions from '@/components/transfusion/InfoTransfusions.vue';
import UnitTable from '@/components/unit/UnitTable.vue';
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { transfusionStatusAssignPermit, transfusionStatusEdit, transfusionStatusReturnAction } from '@/enums/Status';
import { useUnitStore } from '@/stores/storage/units';
import { useTransfusionResultStore } from '@/stores/transfusion/transfusionAssignment';
import { useTransfusionStore } from '@/stores/transfusion/transfusions';
import { required } from '@/validation/validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const transfusionAssignmentStore = useTransfusionResultStore();
const transfusionStore = useTransfusionStore();
const unitStore = useUnitStore();

const transfusionId = computed(() => route.query.transfusionId);
const assignPermit = ref(null);
const returnAction = ref(null);
const isLoading = ref(true);
const canViewTransfusion = ref(false);
const canEditRequest = ref(false);

const showAssignErrorModal = ref(null);

const showRegisterResultSuccessModal = ref(false);
const showRegisterResultErrorModal = ref(false);

const deleteAssingUnit = ref(false);
const showSuccessDeleteAssingUnitModal = ref(false);
const showErrorDeleteAssingUnitModal = ref(false);

const showfreeUnitsTransfusionModal = ref(false);
const showfreeUnitsTransfusionSucessModal = ref(false);
const showfreeUnitsTransfusionErrorModal = ref(false);

const assignIndex = ref(null);
const assignSelected = ref(null);

const route = useRoute();
const router = useRouter();

const rulesRecieved = computed(() => ({
  receivedByDocument: { required: required('Número de documento') },
  receivedByName: { required: required('Nombre') }
}));

const recieved = reactive({ receivedByDocument: '', receivedByName: '' });

const v1$ = useVuelidate(rulesRecieved, recieved, { $scope: false });

const showModalFreeUnits = ref(false);
const transfusion = ref(null);

onMounted(async () => {
  unitStore.idTransfusion = transfusionId;
  await unitStore.getSelectBloodTypesByTransfusion(transfusionId.value);
  await unitStore.setStatusAptoUnits();
  const response = await transfusionStore.getTranfusionAllInfo(transfusionId.value);
  if (response.canViewTransfusion) {
    transfusion.value = response;
    assignPermit.value = transfusionStatusAssignPermit.includes(response.transfusion.status);
    returnAction.value = transfusionStatusReturnAction.includes(response.transfusion.status);
    canEditRequest.value = transfusionStatusEdit.includes(response.transfusion.status);
  }
  canViewTransfusion.value = response.canViewTransfusion;
  isLoading.value = false;
});

onUnmounted(() => {
  unitStore.setNullIdTransfusion();
});

const assignTransfusionUnit = async (unit) => {
  const transfusionAssignmentReponse = await transfusionAssignmentStore.saveTransfusionAssignment(transfusionId.value, unit.id);
  if (transfusionAssignmentReponse) {
    transfusion.value.assignments.push(transfusionAssignmentReponse);
  } else {
    showAssignErrorModal.value = true;
  }
};

const registerResult = async (index, result) => {
  const assign = transfusion.value.assignments[index];
  const response = await transfusionAssignmentStore.saveValidateResult(assign.id, result);

  if (response) {
    transfusion.value.assignments[index] = response;
    showRegisterResultSuccessModal.value = false;
  } else {
    showRegisterResultErrorModal.value = false;
  }
};

const confirmDeleteAssignUnit = () => {
  showSuccessDeleteAssingUnitModal.value = false;
};

const removeTransfusionUnit = async () => {
  const response = await transfusionAssignmentStore.deleteTransfusionAssignment(assignSelected.value.id);
  if (response) {
    transfusion.value.assignments.splice(assignIndex.value, 1);
    deleteAssingUnit.value = false;
    showSuccessDeleteAssingUnitModal.value = true;
  } else {
    showErrorDeleteAssingUnitModal.value = true;
  }
};

const openRemoveModal = async (index, assign) => {
  assignSelected.value = assign;
  assignIndex.value = index;
  deleteAssingUnit.value = true;
};

const cancelFreeUnits = () => {
  showModalFreeUnits.value = false;
  recieved.receivedByDocument = '';
  recieved.receivedByName = '';
};

const openFreeUnitsModal = async () => {
  const isValid = await v1$.value.$validate();
  if (!isValid) return;
  showfreeUnitsTransfusionModal.value = true;
};

const freeUnits = async () => {
  await transfusionAssignmentStore.dispensedUnits(transfusionId.value, recieved);
  const response = await transfusionStore.getTranfusionAllInfo(transfusionId.value);
  if (response) {
    transfusion.value = response;
    assignPermit.value = transfusionStatusAssignPermit.includes(response.transfusion.status);
    returnAction.value = transfusionStatusReturnAction.includes(response.transfusion.status);
    showModalFreeUnits.value = false;
    showfreeUnitsTransfusionSucessModal.value = true;
  } else {
    showfreeUnitsTransfusionErrorModal.value = true;
  }
};
</script>
<template>
  <div v-if="isLoading" class="card absolute inset-0 bg-white/50 flex items-center justify-center z-10">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else class="card">
    <div v-if="!canViewTransfusion">
      <div class="card felx justify-center items-center">
        <p class="text-red-500">Usted no tiene permisos para visualizar esta transfusión</p>
      </div>
    </div>
    <div v-else>
      <div class="mb-4">
        <h3>Visualizar Transfusión</h3>
      </div>

      <!-- Datos generales de la transfusión -->
      <InfoTransfusions :transfusion="transfusion.transfusion" :is-editable="canEditRequest" />

      <!-- Unidades solicitadas -->
      <UnitTable class="my-4" title="Unidades solicitadas" :read-only="true" type="singleData" :loading="isLoading" v-model="transfusion.request" />

      <!-- Unidades asignada -->
      <UnitTable
        class="my-4"
        title="Unidades asignadas"
        type="resultData"
        type-modal="result"
        :read-only="!assignPermit"
        :assign-permit="assignPermit"
        :return-action="returnAction"
        :loading="isLoading"
        edit-text="Registrar resultado"
        v-model="transfusion.assignments"
        @add="(unit) => assignTransfusionUnit(unit)"
        @result="(index, result) => registerResult(index, result)"
        @remove="(index, assign) => openRemoveModal(index, assign)"
      />

      <!-- Acciones -->
      <div class="flex justify-between">
        <div class="flex flex-1 justify-start px-8 my-8 gap-4">
          <Button v-if="assignPermit" class="h-10 w-full md:max-w-[16rem]" label="Liberar unidades" severity="success" @click="() => (showModalFreeUnits = true)" />
        </div>
        <div class="flex flex-1 justify-end px-8 my-8 gap-4">
          <Button class="h-10 w-full md:max-w-[16rem] btn-clean" label="Regresar" @click="router.back()" />
          <!-- <Button class="h-10 w-full md:max-w-[16rem]" label="Guardar" severity="success" @click="handleSave" /> -->
        </div>
      </div>

      <!-- Resultado -->
      <div class="mt-4">
        <div class="mb-2">
          <h4>Resultado de Transfusión</h4>
        </div>
        <Fieldset legend="Datos de los resultados" class="mb-2">
          <div class="rounded-md px-5 pt-5 pb-2 bg-white">
            <div v-if="transfusion.result === null" class="py-4 text-center">
              <i class="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
              <p class="text-gray-700 font-medium">Resultados de transfusión pendiente</p>
            </div>
            <div v-else>
              <div class="grid grid-cols-1 md:grid-cols-4 md:gap-y-3 gap-x-6">
                <div class="mb-2 md:col-span-2">
                  <div class="mt-2"><span class="font-medium">Fecha de transfusión: </span> {{ transfusion.result.transfusionDate }}</div>
                  <div class="mt-2"><span class="font-medium">N° Documento de enfermero resposanble de transfusion: </span> {{ transfusion.result.transfusionDoctorLicenseNumber }}</div>
                </div>
                <div class="mb-2 md:col-span-2">
                  <div class="mt-2"><span class="font-medium">Registrado el: </span> {{ transfusion.result.createdAt }}</div>
                  <div class="mt-2"><span class="font-medium">Registrado por: </span> {{ transfusion.result.createdByName }}</div>
                </div>
              </div>
              <div class="grid grid-cols-1">
                <div class="mt-2"><span class="font-medium">Enfemero responsable de transfusion: </span> {{ transfusion.result.transfusionDoctorName }}</div>
                <div class="mt-2">
                  <span class="font-medium"> Presentó reacción advsersa: </span><span class="font-bold">{{ transfusion.result.reactionAdverse ? 'SI' : 'NO' }}</span>
                </div>
                <div class="mt-2"><span class="font-medium">Reaccion adversa: </span> {{ transfusion.result.reactionAdverse ?? '-' }}</div>
                <div class="mt-2"><span class="font-medium">Observaciones: </span> {{ transfusion.result.observations }}</div>
              </div>
            </div>
          </div>
        </Fieldset>
      </div>
    </div>

    <Dialog v-model:visible="showModalFreeUnits" header="Liberación de unidades" :modal="true" :closable="false" :style="{ width: '800px' }">
      <div>
        <h6>Identificación del personal médico que recibió las unidades</h6>

        <FloatLabel variant="on" class="mt-4 w-1/2">
          <InputText id="receivedByDocument" v-model="recieved.receivedByDocument" class="w-full" :invalid="v1$.receivedByDocument?.$error" />
          <label for="receivedByDocument">Nro Documento</label>
        </FloatLabel>
        <Message v-if="v1$.receivedByDocument?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v1$.receivedByDocument.$errors[0].$message }}</Message>

        <FloatLabel variant="on" class="mt-4 w-full">
          <InputText id="receivedByName" v-model="recieved.receivedByName" class="w-full" :invalid="v1$.receivedByName?.$error" />
          <label for="receivedByName">Nombres del personal médico</label>
        </FloatLabel>
        <Message v-if="v1$.receivedByName?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v1$.receivedByName.$errors[0].$message }}</Message>
      </div>
      <template #footer>
        <Button label="Cancelar" class="min-w-40 btn-clean" @click="cancelFreeUnits" />
        <Button label="Aceptar" class="min-w-40 p-button-success" @click="openFreeUnitsModal" />
      </template>
    </Dialog>

    <ConfirmModal
      id="deleteAssingUnit"
      v-model="deleteAssingUnit"
      severity="warn"
      header="Eliminar unidad asignada a la solicitud de transfusión"
      :message="`¿Estás seguro de eliminar la asignación de la unidad?`"
      accept-text="Eliminar"
      accept-button-class="p-button-danger"
      @accept="removeTransfusionUnit"
    />
    <SuccessModal id="deleteAssingUnitSuccess" v-model="showSuccessDeleteAssingUnitModal" message="Se ha eliminado la asignación de la unidad a la transfusión" @close="confirmDeleteAssignUnit" />
    <ErrorModal id="errorOperationModal" v-model="showErrorDeleteAssingUnitModal" />

    <SuccessModal id="registerResultSuccess" v-model="showRegisterResultSuccessModal" message="Se ha registrado el resultado" @close="confirmDeleteAssignUnit" />
    <ErrorModal id="registerResultError" v-model="showRegisterResultErrorModal" />

    <ErrorModal id="showAssignErrorModal" v-model="showAssignErrorModal" />

    <ConfirmModal
      id="freeUnitsTranfusion"
      v-model="showfreeUnitsTransfusionModal"
      severity="warn"
      header="Liberación de unidades de almacén para la transfusión"
      :message="`¿Estás seguro de liberar las unidades para la transfusión?`"
      accept-text="Aceptar"
      @accept="freeUnits"
    />
    <SuccessModal id="freeUnitsTranfusionSucess" v-model="showfreeUnitsTransfusionSucessModal" message="Se ha registrado el resultado" @close="() => router.back()" />
    <ErrorModal id="freeUnitsTranfusionError" v-model="showfreeUnitsTransfusionErrorModal" />
  </div>
</template>
