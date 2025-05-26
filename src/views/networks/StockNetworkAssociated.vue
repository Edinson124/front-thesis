<script setup>
import { bloodTypesOptions } from '@/enums/BloodType';
import { unitTypesOptions } from '@/enums/Units';
import { useNetworCollaborationStore } from '@/stores/networks/networks';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const networkCollaborationStore = useNetworCollaborationStore();

const networkId = route.query.network;
// Estado reactivo
const filters = reactive({
  idBloodBank: null,
  entryDate: null,
  expirationDate: null,
  bloodType: null,
  type: null
});

const loading = ref(false);
const loadingAll = ref(false);
const canView = ref(false);

const rules = computed(() => ({
  idBloodBank: { required: required('Banco de sangre') }
}));
const v$ = useVuelidate(rules, filters);

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
  const isValid = await v$.value.$validate();
  if (!isValid) {
    loading.value = false;
    return;
  }
  const page = event ? event.page + 1 : networkCollaborationStore.currentPageUnits;

  const params = {
    type: filters.type,
    bloodType: filters.bloodType,
    idNetwork: networkId,
    idBloodBank: filters.idBloodBank
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

  await networkCollaborationStore.getUnitsStock(params, page);
  loading.value = false;
};

function cleanfilters() {
  filters.entryDate = null;
  filters.expirationDate = null;
  filters.bloodType = null;
  filters.type = null;
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

// Cargar unidades al montar el componente
onMounted(async () => {
  loadingAll.value = true;
  const canViewResponse = await networkCollaborationStore.getOptionsBB(networkId);
  canView.value = canViewResponse;
  loadingAll.value = false;
});
</script>
<template>
  <div class="card">
    <!-- Sección de búsqueda -->
    <div class="mb-6">
      <h3>Visualizar Stock en Redes</h3>
    </div>
    <div v-if="loadingAll" class="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
      <ProgressSpinner style="width: 50px; height: 50px" />
    </div>
    <div v-else>
      <div v-if="canView">
        <div class="grid grid-cols-12 gap-4 mb-3">
          <div class="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
            <div>
              <label class="block mb-1">Seleccione un banco de sangre</label>
              <FloatLabel variant="on">
                <Select id="idBloodBank" v-model="filters.idBloodBank" :options="networkCollaborationStore.bloodBanksOptions" optionLabel="name" optionValue="id" class="w-full" :invalid="v$.idBloodBank?.$error" />
                <label for="idBloodBank">Banco de sangre</label>
              </FloatLabel>
              <Message v-if="v$.idBloodBank?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.idBloodBank.$errors[0].$message }}</Message>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-3">
          <div class="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
            <div>
              <FloatLabel variant="on">
                <DatePicker id="entryDate" v-model="filters.entryDate" showIcon fluid dateFormat="dd/mm/yy" class="w-full" selectionMode="range" :manualInput="false" />
                <label for="entryDate">Rango fecha inicio</label>
              </FloatLabel>
            </div>

            <div>
              <FloatLabel variant="on">
                <DatePicker id="expirationDate" v-model="filters.expirationDate" showIcon showClear fluid dateFormat="dd/mm/yy" class="w-full" selectionMode="range" :manualInput="false" />
                <label for="expirationDate">Rango fecha vencimiento</label>
              </FloatLabel>
            </div>

            <div>
              <FloatLabel variant="on">
                <Select id="bloodType" v-model="filters.bloodType" :options="bloodTypesOptions" optionLabel="label" optionValue="value" showClear class="w-full" />
                <label for="bloodType">Grupo sanguíneo</label>
              </FloatLabel>
            </div>

            <div>
              <FloatLabel variant="on">
                <Select id="type" v-model="filters.type" :options="unitTypesOptions" optionLabel="label" optionValue="value" showClear class="w-full" />
                <label for="type">Tipo de unidad</label>
              </FloatLabel>
            </div>
          </div>
          <div class="col-span-12 md:col-span-4 flex flex-col md:flex-row md:grow justify-end items-center">
            <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Filtrar" severity="info" @click="searchUnits()" />
            <Button class="h-8 w-full md:grow btn-clean" label="Limpiar" @click="cleanfilters()" />
          </div>
        </div>

        <!-- Sección de resultados -->
        <div>
          <h2 class="text-xl font-semibold mb-4">Stock de banco de sangre</h2>

          <DataTable
            :value="networkCollaborationStore.units"
            :paginator="true"
            :rows="10"
            :totalRecords="networkCollaborationStore.totalRecordsUnits"
            :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            currentPageReportTemplate="{first} - {last} de {totalRecords}"
            responsiveLayout="scroll"
            lazy
            stripedRows
            showGridlines
            class="p-datatable-sm"
            @page="onPage"
          >
            <template #empty>
              <p class="text-gray-600 text-lg py-4">No se encontraron unidades disponibles o reservadas con los filtros seleccionados.</p>
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
      <div v-else class="p-6 text-center text-red-700 border border-red-300 rounded-md bg-red-50">
        <h3 class="text-lg font-semibold mb-2">Acceso denegado</h3>
        <p>No puedes ver el stock de la red ya que tu banco de sangre actual no está asociada en a esta red.</p>
      </div>
    </div>
  </div>
</template>
