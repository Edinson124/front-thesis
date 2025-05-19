<script setup>
import { reactive, ref } from 'vue';
import UnitModal from './UnitModal.vue';
import { bagTypes, UnitTypes } from '@/enums/Units';

const props = defineProps({
  title: {
    type: String,
    default: 'Unidades hematológicas'
  },
  type: {
    type: String,
    default: 'allData' // 'allData', 'singleData'
  },
  typeModal: {
    type: String,
    default: 'creation' // 'transformation', "request"
  },
  loading: {
    type: Boolean,
    default: false
  },
  totalUnits: {
    type: Number,
    default: 0
  }
});

const units = defineModel({ type: Array, required: true });

const unitCurrent = reactive({
  type: '',
  volume: '',
  bag: '',
  anticoagulant: ''
});

const showUnitModal = ref(false);
const editingIndex = ref(null);

const openNewUnitModal = () => {
  editingIndex.value = null;
  Object.assign(unitCurrent, { type: '', volume: '', bag: '', anticoagulant: '' });
  showUnitModal.value = true;
};

const openEditUnitModal = (unit, index) => {
  editingIndex.value = index;
  Object.assign(unitCurrent, unit);
  showUnitModal.value = true;
};

const emit = defineEmits(['edit', 'add']);
const saveUnit = (unit) => {
  if (editingIndex.value !== null) {
    emit('edit', editingIndex.value, unit);
  } else {
    emit('add', unit);
  }
};

const columns =
  props.type === 'allData'
    ? [
        { field: 'id', header: 'Código', width: '12%' },
        { field: 'type', header: 'Unidad', width: '30%' },
        { field: 'volume', header: 'Volumen', width: '20%' },
        { field: 'bag', header: 'Tipo de bolsa', width: '12%' }
      ]
    : [
        { field: 'id', header: 'Código', width: '12%' },
        { field: 'type', header: 'Unidad', width: '30%' }
      ];
</script>

<template>
  <div class="my-4">
    <div class="flex justify-between items-center my-4">
      <h4>{{ title }}</h4>
      <Button label="Nueva Unidad" icon="pi pi-plus" class="p-button-success" @click="openNewUnitModal" />
    </div>

    <div class="w-full">
      <DataTable :value="units" tableStyle="min-width: 50rem" paginator :rows="10" :totalRecords="totalUnits" lazy :loading="loading" showGridlines :currentPageReportTemplate="'{currentPage} de {totalPages}'">
        <template #empty>
          <p class="text-gray-600 text-lg py-4">No existen unidades hematológicas.</p>
        </template>

        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :style="`width: ${col.width}`">
          <template #body="slotProps">
            <span>
              <template v-if="col.field === 'type'">
                {{ UnitTypes[slotProps.data.type] }}
              </template>
              <template v-else-if="col.field === 'bag'">
                {{ bagTypes[slotProps.data.bag] }}
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

    <UnitModal v-model="showUnitModal" :unit="unitCurrent" :type="typeModal" @save="saveUnit" />
  </div>
</template>
