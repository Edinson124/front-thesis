<script setup>
import InfoTransfusions from '@/components/transfusion/InfoTransfusions.vue';
import { useTransfusionStore } from '@/stores/transfusion/transfusions';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const transfusionStore = useTransfusionStore();
const transfusionId = computed(() => route.query.transfusionId);
const isLoading = ref(true);
const route = useRoute();

const transfusion = ref(null);
const columnsRequest = [
  { field: 'id', header: 'Código' },
  { field: 'unitType', header: 'Unidad ' },
  { field: 'requestedQuantity', header: 'Cantidad' }
];
onMounted(async () => {
  const response = await transfusionStore.getTranfusionAllInfo(transfusionId.value);
  transfusion.value = response;
  console.log(response);
  isLoading.value = false;
});
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
      <div class="mt-4">
        <div class="mb-2">
          <h4>Unidades solicitadas</h4>
        </div>
        <DataTable :value="transfusion.request" :rows="10" responsiveLayout="scroll" stripedRows showGridlines class="p-datatable-sm">
          <template #empty>
            <p class="text-gray-600 text-lg py-4">No se han ingresado detalles de solicitud.</p>
          </template>

          <Column header="N°" style="width: 3rem; text-align: center">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column v-for="col of columnsRequest" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable"> </Column>
        </DataTable>
      </div>
      <!-- Unidades asignada -->
      <div class="mt-4">
        <div class="mb-2">
          <h4>Unidades Asignadass</h4>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex justify-between">
        <div class="flex flex-1 justify-start px-8 my-8 gap-4">
          <Button class="h-10 w-full md:max-w-[16rem]" label="Liberar unidades" severity="success" @click="handleSave" />
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
  </div>
</template>
