<script setup>
import UnitTable from '@/components/unit/UnitTable.vue';
import { useSampleUnitsStore } from '@/stores/donation/units';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const sampleUnitsStore = useSampleUnitsStore();

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([sampleUnitsStore.fetchUnits(), sampleUnitsStore.fetchUnitTypesCreate(), sampleUnitsStore.fetchUnitBags(), sampleUnitsStore.fetchUnitAnticoagunlants()]);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const handleSave = () => {
  console.log('save');
};
</script>

<template>
  <div class="card">
    <div class="mb-4 flex flex-wrap justify-between items-center gap-2">
      <h3 class="min-w-[10rem] !mt-2"></h3>
      <Button class="h-8 w-full md:grow max-w-[16rem] md:max-w-[16rem]" label="Diferir donante" severity="danger" @click="() => {}" />
    </div>

    <Panel header="Muestra 1" class="my-8">
      <div class="flex flex-row w-full items-center">
        <div class="w-full md:w-1/2 flex flex-col gap-4">
          <FloatLabel variant="on" class="mr-8">
            <InputText id="code-sample-1" class="w-full" disabled />
            <label for="code-sample-1">Código</label>
          </FloatLabel>
          <FloatLabel variant="on" class="mr-8">
            <InputText id="sample-1" class="w-full" />
            <label for="sample-1">Prueba</label>
          </FloatLabel>
        </div>
        <div class="w-full md:w-auto md:grow"><Button label="Obtener etiqueta" class="min-w-40 p-button-success" /></div>
      </div>
    </Panel>
    <Panel header="Muestra 2" class="my-8">
      <div class="flex flex-row w-full items-center">
        <div class="w-full md:w-1/2 flex flex-col gap-4">
          <FloatLabel variant="on" class="mr-8">
            <InputText id="code-sample-2" class="w-full" disabled />
            <label for="code-sample-2">Código</label>
          </FloatLabel>
          <FloatLabel variant="on" class="mr-8">
            <InputText id="sample-2" class="w-full" />
            <label for="sample-2">Prueba</label>
          </FloatLabel>
        </div>
        <div class="w-full md:w-auto md:grow"><Button label="Obtener etiqueta" class="min-w-40 p-button-success" /></div>
      </div>
    </Panel>

    <UnitTable v-model="sampleUnitsStore.units" :loading="loading" :totalUnits="sampleUnitsStore.totalUnits" @edit="(index, unit) => sampleUnitsStore.editUnit(index, unit)" @add="(unit) => sampleUnitsStore.addUnit(unit)" />

    <div class="flex justify-end px-8 my-8 gap-4">
      <Button class="w-full md:max-w-[16rem] btn-clean" label="Cancelar" @click="router.back()" />
      <Button class="w-full md:max-w-[16rem]" label="Guardar" severity="success" @click="handleSave" />
    </div>
  </div>
</template>
