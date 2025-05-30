<script setup>
import InfoTransfusions from '@/components/transfusion/InfoTransfusions.vue';
import UnitTable from '@/components/unit/UnitTable.vue';
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
const isLoading = ref(true);
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
  unitStore.idTranfusion = transfusionId;
  await unitStore.getSelectBloodTypesByTransfusion(transfusionId.value);
  const response = await transfusionStore.getTranfusionAllInfo(transfusionId.value);
  transfusion.value = response;
  isLoading.value = false;
});

onUnmounted(() => {
  unitStore.setNullIdTranfusion();
});

const assignTransfusionUnit = async (unit) => {
  const transfusionAssignmentReponse = await transfusionAssignmentStore.saveTransfusionAssignment(transfusionId.value, unit.id);
  transfusion.value.assignments.push(transfusionAssignmentReponse);
};

const registerResult = async (index, result) => {
  const assign = transfusion.value.assignments[index];
  const response = await transfusionAssignmentStore.saveValidateResult(assign.id, result);
  transfusion.value.assignments[index] = response;
};

const removeTransfusionUnit = async (index, assign) => {
  await transfusionAssignmentStore.deleteTransfusionAssignment(assign.id);
  transfusion.value.assignments.splice(index, 1);
};

const freeUnits = async () => {
  const isValid = await v1$.value.$validate();
  v1$.value.$errors.forEach((e) => console.log(`- ${e.$property}: ${e.$message}`));
  if (!isValid) return;
  await transfusionAssignmentStore.dispensedUnits(transfusionId.value, recieved);
  const response = await transfusionStore.getTranfusionAllInfo(transfusionId.value);
  transfusion.value = response;
  showModalFreeUnits.value = false;
};

const handleSave = () => {
  console.log(transfusion.value);
};
</script>
<template>
  <div v-if="isLoading" class="card absolute inset-0 bg-white/50 flex items-center justify-center z-10">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else class="card">
    <div v-if="!transfusion.canViewTransfusion">
      <div class="card felx justify-center items-center">
        <p class="text-red-500">Usted no tiene permisos para visualizar esta transfusión</p>
      </div>
    </div>
    <div v-else>
      <div class="mb-4">
        <h3>Visualizar Transfusión</h3>
      </div>

      <!-- Datos generales de la transfusión -->
      <InfoTransfusions :transfusion="transfusion.transfusion" />

      <!-- Unidades solicitadas -->
      <UnitTable class="my-4" title="Unidades solicitadas" :read-only="true" type="singleData" :loading="isLoading" v-model="transfusion.request" />

      <!-- Unidades asignada -->
      <UnitTable
        class="my-4"
        title="Unidades asignadas"
        type="resultData"
        type-modal="result"
        :loading="isLoading"
        edit-text="Registrar resultado"
        v-model="transfusion.assignments"
        @add="(unit) => assignTransfusionUnit(unit)"
        @result="(index, result) => registerResult(index, result)"
        @remove="(index, assign) => removeTransfusionUnit(index, assign)"
      />

      <!-- Acciones -->
      <div class="flex justify-between">
        <div class="flex flex-1 justify-start px-8 my-8 gap-4">
          <Button class="h-10 w-full md:max-w-[16rem]" label="Liberar unidades" severity="success" @click="() => (showModalFreeUnits = true)" />
        </div>
        <div class="flex flex-1 justify-end px-8 my-8 gap-4">
          <Button class="h-10 w-full md:max-w-[16rem] btn-clean" label="Cancelar" @click="router.back()" />
          <Button class="h-10 w-full md:max-w-[16rem]" label="Guardar" severity="success" @click="handleSave" />
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
          </div>
        </Fieldset>
      </div>
    </div>

    <Dialog v-model:visible="showModalFreeUnits" header="Liberación de unidades" :modal="true" :closable="false" :style="{ width: '800px' }">
      <div>
        <h6>Identificación médico que recibió las unidades</h6>

        <FloatLabel variant="on" class="mt-4 w-1/2">
          <InputText id="receivedByDocument" v-model="recieved.receivedByDocument" class="w-full" :invalid="v1$.receivedByDocument?.$error" />
          <label for="receivedByDocument">Nro Colegiatura</label>
        </FloatLabel>
        <Message v-if="v1$.receivedByDocument?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v1$.receivedByDocument.$errors[0].$message }}</Message>

        <FloatLabel variant="on" class="mt-4 w-full">
          <InputText id="receivedByName" v-model="recieved.receivedByName" class="w-full" :invalid="v1$.receivedByName?.$error" />
          <label for="receivedByName">Nombres del médico</label>
        </FloatLabel>
        <Message v-if="v1$.receivedByName?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v1$.receivedByName.$errors[0].$message }}</Message>
      </div>
      <template #footer>
        <Button label="Cancelar" class="min-w-40 btn-clean" @click="() => (showModalFreeUnits = false)" />
        <Button label="Aceptar" class="min-w-40 p-button-success" @click="freeUnits" />
      </template>
    </Dialog>
  </div>
</template>
