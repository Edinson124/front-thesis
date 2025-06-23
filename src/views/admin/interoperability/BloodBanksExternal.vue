<script setup>
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import ubicationService from '@/services/ubication';
import { useBloodBanksStore } from '@/stores/admin/blodd-banks';
import { onMounted, reactive, ref } from 'vue';

const bloodBankStore = useBloodBanksStore();

const loading = ref(false);
const filters = reactive({
  name: '',
  region: null,
  province: null,
  district: null,
  status: ''
});

const filter = async (event) => {
  loading.value = true;
  const page = event ? event.page : bloodBankStore.currentPage;
  await bloodBankStore.getBloodBanksExtenal(filters, page);
  loading.value = false;
};

const resetFilters = () => {
  filters.name = '';
  filters.region = null;
  filters.province = null;
  filters.district = null;
  filters.status = '';
  filter();
};

const regions = reactive([]);
const loadingRegions = ref(false);
const provinces = reactive([]);
const loadingProvinces = ref(false);
const distritos = reactive([]);
const loadingDistritos = ref(false);

onMounted(async () => {
  loading.value = true;

  const regionsResponse = await ubicationService.getDepartments();
  regions.splice(0, regions.length, ...regionsResponse);
  loadingRegions.value = false;

  if (filters.region) {
    loadingProvinces.value = true;
    const provincesResponse = await ubicationService.getProvinces(filters.region);
    provinces.splice(0, provinces.length, ...provincesResponse);
    loadingProvinces.value = false;
  }

  if (filters.province) {
    loadingDistritos.value = true;
    const distritosResponse = await ubicationService.getDistritos(filters.region, filters.province);
    distritos.splice(0, distritos.length, ...distritosResponse);
    loadingDistritos.value = false;
  }

  loading.value = false;

  await filter();
});

const onSelectRegion = async (event) => {
  loadingProvinces.value = true;
  let provincesResponse = [];
  if (event.value !== null) {
    provincesResponse = await ubicationService.getProvinces(event.value);
  }
  provinces.splice(0, provinces.length, ...provincesResponse);
  loadingProvinces.value = false;
};

const onSelectProvince = async (event) => {
  loadingDistritos.value = true;
  let distritosResponse = [];
  if (event.value !== null) {
    distritosResponse = await ubicationService.getDistritos(filters.region, event.value);
  }
  distritos.splice(0, distritos.length, ...distritosResponse);
  loadingDistritos.value = false;
};

const showSuccessModal = ref(false);
const showErrorModal = ref(false);

const desactivateDialog = ref(false);
const selectedBloodBank = ref(null);
const confirmDesactivate = (role) => {
  selectedBloodBank.value = role;
  desactivateDialog.value = true;
};
const desactivate = async () => {
  const success = await bloodBankStore.toogleStatus(selectedBloodBank.value.id);
  if (success) {
    showSuccessModal.value = true;
  } else {
    showErrorModal.value = true;
  }
  selectedBloodBank.value = null;
};

const reactivateDialog = ref(false);
const confirmReactivate = (role) => {
  selectedBloodBank.value = role;
  reactivateDialog.value = true;
};
const reactivate = async () => {
  const success = bloodBankStore.toogleStatus(selectedBloodBank.value.id);
  if (success) {
    showSuccessModal.value = true;
  } else {
    showErrorModal.value = true;
  }
  selectedBloodBank.value = null;
};
</script>

<template>
  <div class="p-4 card">
    <div class="bloodbanks-title | mb-4">
      <h3>Credenciales de bancos de sangre externos</h3>
    </div>
    <div class="bloodbank-filters-container | mb-4 w-full flex flex-col lg:flex-row">
      <div class="bloodbank-filters | flex flex-wrap gap-2 w-full lg:w-[70%] mb-2 lg:mb-0">
        <div class="bloodbank-filter | w-full md:w-[35%]">
          <FloatLabel variant="on" class="w-full">
            <InputText class="w-full" id="search" v-model="filters.search" aria-describedby="search-help" />
            <label for="search">Nombre</label>
          </FloatLabel>
        </div>
        <div class="bloodbank-filter | w-full md:w-[20%]">
          <FloatLabel variant="on" class="w-full">
            <Select id="id_region" class="w-full" v-model="filters.region" :options="regions" showClear filter @change="onSelectRegion" :loading="loadingRegions" />
            <label for="id_region">Departamento</label>
          </FloatLabel>
        </div>
        <div class="bloodbank-filter | w-full md:w-[20%]">
          <FloatLabel variant="on" class="w-full">
            <Select id="id_province" class="w-full" v-model="filters.province" :options="provinces" showClear filter @change="onSelectProvince" :disabled="filters.region === null" :loading="loadingProvinces" />
            <label for="id_province">Provincia</label>
          </FloatLabel>
        </div>
        <div class="bloodbank-filter | w-full md:w-[20%]">
          <FloatLabel variant="on" class="w-full">
            <Select id="id_district" class="w-full" v-model="filters.district" :options="distritos" showClear filter :disabled="filters.province === null" :loading="loadingDistritos" />
            <label for="id_district">Distrito</label>
          </FloatLabel>
        </div>
      </div>
      <div class="bloodbank-filters-buttons | flex flex-col md:flex-row md:grow justify-end items-center">
        <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Filtrar" severity="info" @click="filter()" />
        <Button class="h-8 w-full md:grow btn-clean" label="Limpiar" @click="resetFilters()" />
      </div>
    </div>

    <!-- LISTADO EN TABLA-->
    <div class="bloodbanks-table mt-8">
      <DataTable
        :value="bloodBankStore.bloodBanks"
        tableStyle="min-width: 50rem"
        paginator
        :rows="6"
        :totalRecords="bloodBankStore.totalRecords"
        :loading="loading"
        lazy
        showGridlines
        @page="filter"
        :currentPageReportTemplate="'{currentPage} de {totalPages}'"
      >
        <template #empty>
          <p class="text-gray-600 text-lg py-4">No encontramos coincidencias. Intenta con otros términos o ajusta los filtros.</p>
        </template>

        <Column field="id" header="Código" style="width: 5%" />
        <Column field="name" header="Nombre" style="width: 20%" />
        <Column field="address" header="Dirección" style="width: 22%" />
        <Column header="Ubicación" style="width: 22%">
          <template #body="slotProps"> {{ slotProps.data.region }} / {{ slotProps.data.province }} / {{ slotProps.data.district }} </template>
        </Column>
        <Column field="type" header="Tipo" style="width: 10%" />
        <!-- <Column header="Alcance" style="width: 10%">
          <template #body="slotProps">
            {{ isInternalOptions.find((opt) => opt.value === slotProps.data.isInternal)?.label || '-' }}
          </template>
        </Column> -->
        <Column header="Acciones">
          <template #body="slotProps">
            <div class="flex flex-wrap w-full justify-center">
              <Button class="h-8 w-[6rem] mr-1 my-1 btn-edit" label="Editar" as="router-link" :to="`/admin/blood-banks/${slotProps.data.id}`" />
              <Button v-if="slotProps.data.status === 'ACTIVE'" class="h-8 w-[6rem] my-1" label="Desactivar" severity="danger" @click="confirmDesactivate(slotProps.data)" />
              <Button v-else class="h-8 w-[6rem] my-1" label="Activar" severity="success" @click="confirmReactivate(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <ConfirmModal
      id="desactivateDialog"
      v-model="desactivateDialog"
      severity="warn"
      header="Desactivar banco de sangre"
      :message="`¿Estás seguro de desactivar a ${selectedBloodBank?.name}?`"
      accept-text="Desactivar"
      accept-button-class="p-button-danger"
      @accept="desactivate"
    />
    <ConfirmModal
      id="reactivateDialog"
      v-model="reactivateDialog"
      severity="warn"
      header="Activar banco de sangre"
      :message="`¿Estás seguro de activar a ${selectedBloodBank?.name}?`"
      accept-text="Activar"
      accept-button-class="p-button-success"
      @accept="reactivate"
    />
    <SuccessModal v-model="showSuccessModal" />
    <ErrorModal v-model="showErrorModal" />
  </div>
</template>
