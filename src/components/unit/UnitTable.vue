<script setup>
import { reactive, ref } from 'vue';
import UnitModal from './UnitModal.vue';
import { bagTypes, UnitTypes } from '@/enums/Units';
import StockUnitsModal from '../storage/StockUnitsModal.vue';
import RegisterCrossTestResultModal from '../transfusion/RegisterCrossTestResultModal.vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Unidades hematológicas'
  },
  type: {
    type: String,
    default: 'allData' // 'allData', 'singleData', 'resultData','shipmentData'
  },
  subtype: {
    type: String,
    default: null //'shipment'
  },
  typeModal: {
    type: String,
    default: 'creation' // 'transformation', "request", "result", "shipment"
  },
  loading: {
    type: Boolean,
    default: false
  },
  editText: {
    type: String,
    default: 'Editar'
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

const unitCurrent = reactive({
  type: '',
  volume: '',
  bag: '',
  anticoagulant: ''
});

const showUnitModal = ref(false);
const showModalStockUnits = ref(false);
const showModalRegisterResult = ref(false);
const editingIndex = ref(null);

const openNewUnitModal = () => {
  editingIndex.value = null;
  Object.assign(unitCurrent, { type: '', volume: '', bag: '', anticoagulant: '' });
  showUnitModal.value = true;
};

const openAssignUnitModal = () => {
  editingIndex.value = null;
  Object.assign(unitCurrent, {});
  showModalStockUnits.value = true;
};

const openRegisterResultModal = (unit, index) => {
  editingIndex.value = index;
  Object.assign(unitCurrent, unit);
  showModalRegisterResult.value = true;
};

const openEditUnitModal = (unit, index) => {
  console.log(unit, index);
  editingIndex.value = index;
  Object.assign(unitCurrent, unit);
  showUnitModal.value = true;
};

const emit = defineEmits(['edit', 'add', 'remove', 'result']);

const removeItem = (index, assign) => {
  emit('remove', index, assign);
};

const saveResult = (result) => {
  emit('result', editingIndex.value, result);
};

const saveUnit = (unit) => {
  if (editingIndex.value !== null) {
    emit('edit', editingIndex.value, unit);
  } else {
    emit('add', unit);
  }
};

const columns = [
  ...(props.type === 'allData'
    ? [
        { field: 'id', header: 'Código', width: '12%' },
        { field: 'type', header: 'Unidad', width: '30%' },
        { field: 'volume', header: 'Volumen', width: '20%' },
        { field: 'bag', header: 'Tipo de bolsa', width: '12%' }
      ]
    : []),
  ...(props.type === 'singleData'
    ? [
        { field: 'index', header: 'Indice', width: '10%' },
        { field: 'unitType', header: 'Unidad', width: '25%' },
        { field: 'requestedQuantity', header: 'Cantidad', width: '15%' }
      ]
    : []),
  ...(props.type === 'shipmentData'
    ? [
        { field: 'index', header: 'Indice', width: '10%' },
        { field: 'unitType', header: 'Unidad', width: '25%' },
        { field: 'bloodGroup', header: 'Grupo Sanguíneo', width: '15%' },
        { field: 'rhFactor', header: 'Rh', width: '15%' },
        { field: 'requestedQuantity', header: 'Cantidad', width: '15%' }
      ]
    : []),
  ...(props.type === 'shipmentDataAssign'
    ? [
        { field: 'index', header: 'Indice', width: '10%' },
        { field: 'unitType', header: 'Unidad', width: '25%' },
        { field: 'bloodGroup', header: 'Grupo Sanguíneo', width: '15%' },
        { field: 'rhFactor', header: 'Rh', width: '15%' },
        { field: 'expirationDate', header: 'Fecha de vencimiento', width: '15%' }
      ]
    : []),
  ...(props.type === 'resultData'
    ? [
        { field: 'index', header: 'Indice', width: '5%' },
        { field: 'idUnit', header: 'Código', width: '5%' },
        { field: 'unitType', header: 'Unidad', width: '22%' },
        { field: 'bloodType', header: 'Grupo sanguíneo', width: '18%' },
        { field: 'validateResult', header: 'Resultado', width: '15%' },
        { field: 'performedTestByName', header: 'Resultado registrado por', width: '18%' }
      ]
    : []),
  ...(props.audit ? [{ field: 'updatedBy', header: 'Actualizado por', width: '12%' }] : [])
];
</script>

<template>
  <div class="my-4">
    <div class="flex justify-between items-center my-4">
      <h4>{{ title }}</h4>
      <template v-if="!readOnly">
        <Button v-if="typeModal !== 'result'" label="Nueva Unidad" icon="pi pi-plus" class="p-button-success" @click="openNewUnitModal" />
        <Button v-else-if="typeModal == 'result' && assignPermit" label="Asignar Unidad" icon="pi pi-plus" class="p-button-success" @click="openAssignUnitModal" />
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
              <template v-else-if="col.field === 'type'">
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
        <template v-if="!readOnly">
          <Column header="Acciones">
            <template #body="slotProps">
              <div class="flex flex-wrap w-full">
                <Button v-if="typeModal !== 'result'" class="h-8 w-[6rem] mr-1 my-1 btn-edit" label="Editar" @click="() => openEditUnitModal(slotProps.data, slotProps.index)" />
                <Button v-if="typeModal === 'result' && !returnAction" class="h-8 w-[12rem] mr-1 my-1 btn-edit" label="Registrar resultado" @click="() => openRegisterResultModal(slotProps.data, slotProps.index)" />
                <Button v-if="typeModal === 'result' && returnAction" class="h-8 w-[12rem] mr-1 my-1 btn-edit" label="Devolución" @click="() => openRegisterResultModal(slotProps.data, slotProps.index)" />
                <Button v-if="!returnAction" class="h-8 w-[6rem] mr-1 my-1" label="Eliminar" severity="danger" @click="removeItem(slotProps.index, slotProps.data)" />
              </div>
            </template>
          </Column>
        </template>
      </DataTable>
    </div>

    <UnitModal v-if="typeModal !== 'result'" v-model="showUnitModal" :unit="unitCurrent" :type="typeModal" :subtype="subtype" @save="saveUnit" />
    <StockUnitsModal v-else v-model="showModalStockUnits" :unit="unitCurrent" @select="saveUnit" />

    <RegisterCrossTestResultModal v-if="typeModal === 'result'" v-model="showModalRegisterResult" @save="saveResult" />
  </div>
</template>
