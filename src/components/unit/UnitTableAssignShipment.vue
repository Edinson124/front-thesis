<script setup>
import { reactive, ref } from 'vue';
import UnitModal from './UnitModal.vue';
import StockUnitsModal from '../storage/StockUnitsModal.vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Unidades hematológicas'
  },
  type: {
    type: String,
    default: 'shipmentData' //'shipmentData', 'shipmentDataAssign'
  },
  subtype: {
    type: String,
    default: null //'shipment'
  },
  typeModal: {
    type: String,
    default: 'creation' // "request", "assign"
  },
  loading: {
    type: Boolean,
    default: false
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  assignPermit: {
    type: Boolean,
    default: false
  },
  returnAction: {
    type: Boolean,
    default: false
  },
  audit: {
    type: Boolean,
    default: false
  }
});

const units = defineModel({ type: Array, default: () => [] });

const columns = [
  ...(props.type === 'shipmentData'
    ? [
        { field: 'index', header: 'N°', width: '5%' },
        { field: 'unitType', header: 'Unidad', width: '25%' },
        { field: 'bloodGroup', header: 'Grupo Sanguíneo', width: '15%' },
        { field: 'rhFactor', header: 'Rh', width: '15%' },
        { field: 'requestedQuantity', header: 'Cantidad', width: '15%' }
      ]
    : []),
  ...(props.type === 'shipmentDataAssign'
    ? [
        { field: 'index', header: 'N°', width: '5%' },
        { field: 'id', header: 'Código', width: '11%' },
        { field: 'stampPronahebas', header: 'Sello Pronahebas', width: '11%' },
        { field: 'unitType', header: 'Unidad', width: '25%' },
        { field: 'bloodGroup', header: 'Grupo Sanguíneo', width: '15%' },
        { field: 'rhFactor', header: 'Rh', width: '15%' },
        { field: 'expirationDate', header: 'Fecha de vencimiento', width: '15%' }
      ]
    : []),
  ...(props.audit ? [{ field: 'updatedBy', header: 'Actualizado por', width: '12%' }] : [])
];

const fields = columns.length > 0 ? columns.map((column) => column.field) : [];

const getEmptyUnitState = () => {
  const emptyState = {};
  fields.forEach((field) => {
    emptyState[field] = '';
  });
  return emptyState;
};

const unitCurrent = reactive({});

const showUnitModal = ref(false);
const showModalStockUnits = ref(false);
const editingIndex = ref(null);

const openNewUnitModal = () => {
  editingIndex.value = null;
  Object.assign(unitCurrent, getEmptyUnitState());
  showUnitModal.value = true;
};

const openAssignUnitModal = () => {
  editingIndex.value = null;
  Object.assign(unitCurrent, getEmptyUnitState());
  showModalStockUnits.value = true;
};

const openEditUnitModal = (unit, index) => {
  editingIndex.value = index;
  Object.assign(unitCurrent, getEmptyUnitState(), unit);
  showUnitModal.value = true;
};

const emit = defineEmits(['edit', 'add', 'remove', 'view']);

const removeItem = (index, assign) => {
  emit('remove', index, assign);
};

const viewUnit = (unidad) => {
  emit('view', unidad);
};

const saveUnit = (unit) => {
  if (editingIndex.value !== null) {
    emit('edit', editingIndex.value, unit);
  } else {
    emit('add', unit);
  }
};
</script>

<template>
  <div class="my-4">
    <div class="flex justify-between items-center my-4">
      <h4>{{ title }}</h4>
      <template v-if="!readOnly">
        <Button v-if="typeModal !== 'assign'" label="Nueva Unidad" icon="pi pi-plus" class="p-button-success" @click="openNewUnitModal" />
        <Button v-else-if="typeModal == 'assign' && assignPermit" label="Asignar Unidad" icon="pi pi-plus" class="p-button-success" @click="openAssignUnitModal" />
      </template>
    </div>

    <div class="w-full">
      <DataTable :value="units" tableStyle="min-width: 50rem" lazy :loading="loading" showGridlines :currentPageReportTemplate="'{currentPage} de {totalPages}'">
        <template #empty>
          <p class="text-gray-600 text-lg py-4">No existen unidades hematológicas.</p>
        </template>

        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :style="`width: ${col.width}`">
          <template #body="slotProps">
            <span>
              <template v-if="col.field === 'index'">
                {{ slotProps.index + 1 }}
              </template>
              <template v-else-if="type === 'shipmentDataAssign' && col.field === 'bloodGroup'">
                {{ slotProps.data.bloodType?.charAt(0) }}
              </template>
              <template v-else-if="type === 'shipmentDataAssign' && col.field === 'rhFactor'">
                {{ slotProps.data.bloodType?.includes('+') ? 'POSITIVO' : 'NEGATIVO' }}
              </template>
              <template v-else>
                {{ slotProps.data[col.field] }}
              </template>
            </span>
          </template>
        </Column>
        <template v-if="!readOnly">
          <Column header="Acciones">
            <template #body="slotProps">
              <div class="flex flex-wrap w-full">
                <Button v-if="typeModal !== 'assign'" class="h-8 w-[6rem] mr-1 my-1 btn-edit" label="Editar" @click="() => openEditUnitModal(slotProps.data, slotProps.index)" />
                <Button class="h-8 w-[6rem] mr-1 my-1" label="Eliminar" severity="danger" @click="removeItem(slotProps.index, slotProps.data)" />
              </div>
            </template>
          </Column>
        </template>
        <template v-else-if="readOnly && type == 'shipmentDataAssign'">
          <Column header="Acciones">
            <template #body="slotProps">
              <div class="flex flex-wrap w-full">
                <Button class="h-8 btn-view" label="Visualizar" @click="viewUnit(slotProps.data)" />
              </div>
            </template>
          </Column>
        </template>
      </DataTable>
    </div>

    <UnitModal v-if="typeModal !== 'assign'" v-model="showUnitModal" :unit="unitCurrent" :type="typeModal" :subtype="subtype" @save="saveUnit" />
    <StockUnitsModal
      v-else
      v-model="showModalStockUnits"
      :header="'¿Estás seguro de asignar esta unidad a la solicitud de transferencia?'"
      :message="'Si la asignas será reservada, y al liberarla se trasladrá al banco de sangre de la solicitud'"
      :only-suitable="true"
      @select="saveUnit"
    />
  </div>
</template>
