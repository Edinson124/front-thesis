<script setup>
import InfoTransfusions from '@/components/transfusion/InfoTransfusions.vue';
import UnitTable from '@/components/unit/UnitTable.vue';
import { useTransfusionStore } from '@/stores/transfusion/transfusions';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const transfusionStore = useTransfusionStore();
const transfusionId = computed(() => route.query.transfusionId);
const isLoading = ref(true);
const route = useRoute();

const showModalFreeUnits = ref(false);

const transfusion = ref(null);

onMounted(async () => {
  const response = await transfusionStore.getTranfusionAllInfo(transfusionId.value);
  transfusion.value = response;
  isLoading.value = false;
});

const tuitionNumber = ref('');
const doctor = ref('');
const freeUnits = async () => {
  const response = await transfusionStore.freeTransusionUnits(transfusionId.value, tuitionNumber, doctor);
};

const handleSave = () => {};
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
        :edit-text="'Registrar resultado'"
        v-model="transfusion.result"
        @edit="(index, unit) => transfusionStore.registerTransfusionResult(index, unit)"
        @add="(unit) => transfusionStore.addTransfusionUnit(unit)"
        @remove="(unit) => transfusionStore.removeTransfusionUnit(unit)"
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
          <InputText id="tuitionNumber" v-model="tuitionNumber" class="w-full" />
          <label for="tuitionNumber">Nro Colegiatura</label>
        </FloatLabel>

        <FloatLabel variant="on" class="mt-4 w-full">
          <InputText id="doctor" v-model="doctor" class="w-full" />
          <label for="doctor">Nombres del médico</label>
        </FloatLabel>
      </div>
      <template #footer>
        <Button label="Cancelar" class="min-w-40 btn-clean" @click="() => (showModalFreeUnits = false)" />
        <Button label="Aceptar" class="min-w-40 p-button-success" @click="freeUnits" />
      </template>
    </Dialog>
  </div>
</template>
