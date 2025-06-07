<script setup>
import { RhFactor } from '@/enums/BloodType';
import { unitTypesOptions } from '@/enums/Units';
import { useUnitStore } from '@/stores/storage/units';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const unitStore = useUnitStore();

const props = defineProps({
  mode: {
    type: String,
    default: 'viewable' // 'selectable'
  },
  onlySuitable: {
    type: Boolean,
    default: false
  }
});

// Estado reactivo
const filters = reactive({
  entryDate: null,
  expirationDate: null,
  bloodType: null,
  type: null,
  status: null
});

const loading = ref(false);

// Columnas de la tabla
const columns = [
  { field: 'id', header: 'Código' },
  { field: 'unitType', header: 'Tipo de Unidad' },
  { field: 'bloodGroup', header: 'Grupo Sanguíneo' },
  { field: 'rhFactor', header: 'Factor Rh' },
  { field: 'entryDate', header: 'Fecha Ingreso' },
  { field: 'expirationDate', header: 'Fecha Vencimiento' },
  { field: 'status', header: 'Estado' }
];

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const searchUnits = async (event) => {
  loading.value = true;
  const page = event ? event.page + 1 : unitStore.currentPage;

  const params = {
    type: filters.type,
    bloodType: filters.bloodType,
    status: filters.status
  };

  // Procesar rango de fecha de ingreso
  if (filters.entryDate && filters.entryDate.length > 0) {
    const [start, end] = filters.entryDate;
    if (start) {
      params.startEntryDate = formatDate(start);
    }
    if (end) {
      params.endEntryDate = formatDate(end);
    }
  }

  // Procesar rango de fecha de vencimiento
  if (filters.expirationDate && filters.expirationDate.length > 0) {
    const [start, end] = filters.expirationDate;
    if (start) {
      params.startExpirationDate = formatDate(start);
    }
    if (end) {
      params.endExpirationDate = formatDate(end);
    }
  }
  if (unitStore.idTranfusion) {
    params.idTranfusion = unitStore.idTranfusion;
  }
  if (props.onlySuitable) {
    params.onlySuitable = props.onlySuitable;
  }
  await unitStore.getUnits(params, page);
  loading.value = false;
};

function cleanfilters() {
  filters.entryDate = null;
  filters.expirationDate = null;
  filters.bloodType = null;
  filters.type = null;
  filters.status = null;
  searchUnits();
}

function onPage(event) {
  console.log('Cambio de página:', event);
}

function visualizarUnidad(unidad) {
  router.push({
    path: '/unit/view',
    query: { donationId: unidad.donationId, unitId: unidad.id }
  });
}

const emit = defineEmits(['select']);
const select = (unit) => {
  emit('select', unit);
};

const getBloodGroup = (bloodType) => {
  if (!bloodType) return '';
  return bloodType.replace(/[+-]/, '');
};

const getRhFactorLabel = (bloodType) => {
  if (!bloodType) return '';
  if (bloodType.endsWith(RhFactor.POSITIVO.symbol)) return RhFactor.POSITIVO.label;
  if (bloodType.endsWith(RhFactor.NEGATIVO.symbol)) return RhFactor.NEGATIVO.label;
  return '';
};

// Cargar unidades al montar el componente
onMounted(async () => {
  await searchUnits();
});
</script>
<template>
  <div>
    <!-- Sección de búsqueda -->
    <div class="mb-6">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
          <div>
            <FloatLabel variant="on">
              <DatePicker id="entryDate" v-model="filters.entryDate" showIcon fluid dateFormat="dd/mm/yy" class="w-full" selectionMode="range" :manualInput="false" />
              <label for="entryDate">Rango fecha inicio</label>
            </FloatLabel>
          </div>

          <div>
            <FloatLabel variant="on">
              <DatePicker id="expirationDate" v-model="filters.expirationDate" showIcon fluid dateFormat="dd/mm/yy" class="w-full" selectionMode="range" :manualInput="false" />
              <label for="expirationDate">Rango fecha vencimiento</label>
            </FloatLabel>
          </div>

          <div>
            <FloatLabel variant="on">
              <Select id="bloodType" v-model="filters.bloodType" :options="unitStore.bloodTypesSelect" optionLabel="label" optionValue="value" class="w-full" />
              <label for="bloodType">Grupo sanguíneo</label>
            </FloatLabel>
          </div>

          <div>
            <FloatLabel variant="on">
              <Select id="type" v-model="filters.type" :options="unitTypesOptions" optionLabel="label" optionValue="value" class="w-full" />
              <label for="type">Tipo de unidad</label>
            </FloatLabel>
          </div>

          <div>
            <FloatLabel variant="on">
              <Select id="status" v-model="filters.status" :options="unitStore.statusTypesSelect" optionLabel="label" optionValue="value" class="w-full" />
              <label for="status">Estado</label>
            </FloatLabel>
          </div>
        </div>
        <div class="col-span-12 md:col-span-4 flex flex-col md:flex-row md:grow justify-end items-center">
          <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Filtrar" severity="info" @click="searchUnits()" />
          <Button class="h-8 w-full md:grow btn-clean" label="Limpiar" @click="cleanfilters()" />
        </div>
      </div>
    </div>

    <!-- Sección de resultados -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Resultados de unidades para fraccionar</h2>

      <DataTable
        :value="unitStore.units"
        :paginator="true"
        :rows="10"
        :totalRecords="unitStore.totalRecords"
        :loading="loading"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="{first} - {last} de {totalRecords}"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
        class="p-datatable-sm"
        @page="onPage"
      >
        <template #empty>
          <p class="text-gray-600 text-lg py-4">No se encontraron unidades disponibles o reservadas con los filtros seleccionados.</p>
        </template>

        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable">
          <template v-if="col.field === 'bloodGroup'" #body="slotProps">
            {{ getBloodGroup(slotProps.data.bloodType) }}
          </template>

          <template v-else-if="col.field === 'rhFactor'" #body="slotProps">
            {{ getRhFactorLabel(slotProps.data.bloodType) }}
          </template>

          <template v-else #body="slotProps">
            {{ slotProps.data[col.field] }}
          </template>
        </Column>
        <Column header="Acciones" :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <div class="flex justify-center">
              <Button v-if="mode === 'viewable'" class="h-8 btn-view" label="Visualizar" @click="visualizarUnidad(slotProps.data)" />
              <Button v-if="mode === 'selectable'" class="h-8 btn-view" label="Seleccionar" @click="select(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
