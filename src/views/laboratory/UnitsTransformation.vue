<script setup>
import { bloodTypesOptions } from '@/enums/BloodType';
import { unitTypesOptions } from '@/enums/Units';
import { useUnitsTranformationStore } from '@/stores/laboratory/unitsTranformation';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const unitsTransformationStore = useUnitsTranformationStore();
// Estado reactivo
const filters = reactive({
  entryDate: null,
  expirationDate: null,
  bloodType: null,
  type: null
});

const loading = ref(false);

// Columnas de la tabla
const columns = [
  { field: 'id', header: 'Código' },
  { field: 'unitType', header: 'Tipo de Unidad' },
  { field: 'bloodType', header: 'Grupo Sanguíneo' },
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
  const page = event ? event.page + 1 : unitsTransformationStore.currentPage;

  const params = {
    type: filters.type,
    bloodType: filters.bloodType
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

  await unitsTransformationStore.getUnits(params, page);
  loading.value = false;
};

function cleanfilters() {
  filters.fechaInicio = null;
  filters.fechaVencimiento = null;
  filters.grupoSanguineo = null;
  filters.tipoUnidad = null;
  searchUnits();
}

function onPage(event) {
  console.log('Cambio de página:', event);
}

function visualizarUnidad(unidad) {
  router.push({
    path: '/laboratory/unit/transformation',
    query: { donationId: unidad.donationId, unitId: unidad.id }
  });
}

// Cargar unidades al montar el componente
onMounted(async () => {
  await searchUnits();
});
</script>
<template>
  <div class="card">
    <!-- Sección de búsqueda -->
    <div class="mb-6">
      <h3>Búsqueda de unidades para fraccionar</h3>

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
              <Select id="bloodType" v-model="filters.bloodType" :options="bloodTypesOptions" optionLabel="label" optionValue="value" class="w-full" />
              <label for="bloodType">Grupo sanguíneo</label>
            </FloatLabel>
          </div>

          <div>
            <FloatLabel variant="on">
              <Select id="type" v-model="filters.type" :options="unitTypesOptions" optionLabel="label" optionValue="value" class="w-full" />
              <label for="type">Tipo de unidad</label>
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
        :value="unitsTransformationStore.units"
        :paginator="true"
        :rows="10"
        :totalRecords="unitsTransformationStore.totalRecords"
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
          <p class="text-gray-600 text-lg py-4">No se encontraron unidades para fraccionar con los filtros seleccionados.</p>
        </template>

        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable"> </Column>

        <Column header="Acciones" :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <div class="flex justify-center">
              <Button class="h-8 w-[6rem] mr-1 my-1 btn-edit" label="Fraccionar" @click="visualizarUnidad(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
