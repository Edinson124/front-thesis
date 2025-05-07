<script setup>
import { useSampleUnitsStore } from '@/stores/donation/sample-units';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import UnitModal from './UnitModal.vue';

const router = useRouter();
const loading = ref(false);
const sampleUnitsStore = useSampleUnitsStore();

const showUnitModal = ref(false);
const editingIndex = ref(null);

const columns = [
  { field: 'id', header: 'Código', width: '12%' },
  { field: 'unit', header: 'Unidad', width: '30%' },
  { field: 'volume', header: 'Volumen', width: '20%' },
  { field: 'package', header: 'TIpo de bolsa', width: '12%' }
];

const unitCurrent = reactive({
  type: '',
  unit: '',
  volume: '',
  package: ''
});

onMounted(async () => {
  await sampleUnitsStore.fetchUnits();
  await sampleUnitsStore.fetchUnitTypes();
  await sampleUnitsStore.fetchUnitPackages();
  await sampleUnitsStore.fetchUnitNames();
});

const openNewUnitModal = () => {
  editingIndex.value = null;
  unitCurrent.value = { type: '', unit: '', volume: '', package: '' };
  showUnitModal.value = true;
};

const openEditUnitModal = (unit, index) => {
  editingIndex.value = index;
  unitCurrent.value = { ...unit };
  showUnitModal.value = true;
};

const saveUnit = (unit) => {
  if (editingIndex.value !== null) {
    sampleUnitsStore.editUnit(editingIndex.value, unit);
  } else {
    sampleUnitsStore.addUnit(unit);
  }
};

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

    <div class="my-4">
      <div class="flex justify-between items-center my-4">
        <h2 class="text-xl">Unidades hematológicas</h2>
        <Button label="Nueva Unidad" icon="pi pi-plus" class="p-button-success" @click="openNewUnitModal" />
      </div>

      <div class="w-full">
        <DataTable :value="sampleUnitsStore.units" tableStyle="min-width: 50rem" paginator :rows="10" :totalRecords="sampleUnitsStore.units.length" lazy :loading="loading" showGridlines :currentPageReportTemplate="'{currentPage} de {totalPages}'">
          <template #empty>
            <p class="text-gray-600 text-lg py-4">No encontramos donaciones para este donante.</p>
          </template>

          <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :style="`width: ${col.width}`">
            <template #body="slotProps">
              <span>
                <template v-if="col.field === 'unit'">
                  {{ sampleUnitsStore.findUnitName(slotProps.data.unit) }}
                </template>
                <template v-else-if="col.field === 'package'">
                  {{ sampleUnitsStore.findPackageName(slotProps.data.package) }}
                </template>
                <template v-else>
                  {{ slotProps.data[col.field] }}
                </template>
              </span>
            </template>
          </Column>
          <Column header="Acciones">
            <template #body="slotProps">
              <div class="flex flex-wrap w-full">
                <Button class="h-8 w-[6rem] mr-1 my-1 btn-edit" label="Editar" @click="() => openEditUnitModal(slotProps.data, slotProps.index)" />
                <Button class="h-8 w-[6rem] mr-1 my-1" label="Eliminar" severity="danger" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <div class="flex justify-end px-8 my-8 gap-4">
      <Button class="w-full md:max-w-[16rem] btn-clean" label="Cancelar" @click="router.back()" />
      <Button class="w-full md:max-w-[16rem]" label="Guardar" severity="success" @click="handleSave" />
    </div>

    <UnitModal v-model="showUnitModal" :unit="unitCurrent" @save="saveUnit" />
  </div>
</template>
