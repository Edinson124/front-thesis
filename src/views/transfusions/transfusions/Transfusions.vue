<script setup>
import { tranfusionStatusOptions } from '@/enums/Status';
import { useTransfusionStore } from '@/stores/transfusion/transfusions';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const transfusionStore = useTransfusionStore();

const filters = reactive({
  entryDate: null,
  code: null,
  status: null
});

const loading = ref(false);

// Columnas de la tabla
const columns = [
  { field: 'id', header: 'Código' },
  { field: 'patientDocumentNumber', header: 'N° Documento' },
  { field: 'patientName', header: 'Paciente' },
  { field: 'attendingDoctorName', header: 'Médico Solicitante' },
  { field: 'date', header: 'Fecha' },
  { field: 'status', header: 'Estado' }
];

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const searchTranfusions = async (event) => {
  loading.value = true;
  const page = event ? event.page + 1 : transfusionStore.currentPage;

  const params = {
    code: filters.code,
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

  await transfusionStore.getTransfusions(params, page);
  loading.value = false;
};

function cleanfilters() {
  filters.entryDate = null;
  filters.code = null;
  filters.grupoSanguineo = null;
  filters.status = null;
  searchTranfusions();
}

function onPage(event) {
  console.log('Cambio de página:', event);
}

function visualizarUnidad(transfusion) {
  router.push({
    path: '/transfusion/view',
    query: { transfusionId: transfusion.id }
  });
}

// Cargar unidades al montar el componente
onMounted(async () => {
  await searchTranfusions();
});
</script>
<template>
  <div class="card">
    <!-- Sección de búsqueda -->
    <div class="mb-6">
      <h3>Solicitudes de transfusión</h3>

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-1">
          <div>
            <FloatLabel variant="on">
              <InputText id="code" v-model="filters.code" class="w-full" />
              <label for="code">Código de solicitud</label>
            </FloatLabel>
          </div>

          <div>
            <FloatLabel variant="on">
              <DatePicker id="entryDate" v-model="filters.entryDate" showIcon fluid dateFormat="dd/mm/yy" class="w-full" selectionMode="range" :manualInput="false" />
              <label for="entryDate">Rango fecha de solicitud</label>
            </FloatLabel>
          </div>

          <div>
            <FloatLabel variant="on">
              <Select id="status" v-model="filters.status" :options="tranfusionStatusOptions" optionLabel="label" optionValue="value" class="w-full" />
              <label for="status">Estado</label>
            </FloatLabel>
          </div>
        </div>
        <div class="col-span-12 md:col-span-4 flex flex-col md:flex-row md:grow justify-end items-center">
          <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Filtrar" severity="info" @click="searchTranfusions()" />
          <Button class="h-8 w-full md:grow btn-clean" label="Limpiar" @click="cleanfilters()" />
        </div>
      </div>
    </div>

    <!-- Sección de resultados -->
    <div>
      <div class="w-full mb-4 flex flex-wrap justify-between">
        <h2 class="text-xl font-semibold mb-4">Resultados de Solicitudes</h2>
        <Button class="h-8 w-full md:w-[50%] sm:max-w-[16rem]" label="Nueva Solicitud" icon="pi pi-plus" severity="success" as="router-link" to="/admin/users/new" />
      </div>
      <DataTable
        :value="transfusionStore.transfusions"
        :paginator="true"
        :rows="10"
        :totalRecords="transfusionStore.totalRecords"
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
          <p class="text-gray-600 text-lg py-4">No se encontraron tranfusisones con los filtros seleccionados.</p>
        </template>

        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable"> </Column>

        <Column header="Acciones" :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <div class="flex justify-center">
              <Button class="h-8 btn-view" label="Visualizar" @click="visualizarUnidad(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
