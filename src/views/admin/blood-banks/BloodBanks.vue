<script setup>
import ubicationService from '@/services/ubication';
import { useBloodBanksStore } from '@/stores/blodd-banks';
import { onMounted, reactive, ref } from 'vue';

const bloodBankStore = useBloodBanksStore();

const loading = ref(false);
const filters = reactive({
  search: '',
  department: null,
  province: null,
  district: null,
  status: ''
});

const filter = async (event) => {
  loading.value = true;
  const page = event ? event.page : bloodBankStore.currentPage;
  await bloodBankStore.getBloodBanks(filters, page);
  loading.value = false;
};

const resetFilters = () => {
  filters.search = '';
  filters.department = null;
  filters.province = null;
  filters.district = null;
  filters.status = '';
  filter();
};

const departments = reactive([]);
const loadingDeparments = ref(false);
const provinces = reactive([]);
const loadingProvinces = ref(false);
const distritos = reactive([]);
const loadingDistritos = ref(false);

onMounted(async () => {
  loading.value = true;

  const departmentsResponse = await ubicationService.getDepartments();
  departments.splice(0, departments.length, ...departmentsResponse);
  loadingDeparments.value = false;

  if (filters.department) {
    loadingProvinces.value = true;
    const provincesResponse = await ubicationService.getProvinces(filters.department);
    provinces.splice(0, provinces.length, ...provincesResponse);
    loadingProvinces.value = false;
  }

  if (filters.province) {
    loadingDistritos.value = true;
    const distritosResponse = await ubicationService.getDistritos(filters.department, filters.province);
    distritos.splice(0, distritos.length, ...distritosResponse);
    loadingDistritos.value = false;
  }

  loading.value = false;

  await filter();
});

const onSelectDepartment = async (event) => {
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
    distritosResponse = await ubicationService.getDistritos(filters.department, event.value);
  }
  distritos.splice(0, distritos.length, ...distritosResponse);
  loadingDistritos.value = false;
};

// const statuses = ['ACTIVE', 'INACTIVE'];
// const statusesOptions = statuses.map((status) => ({
//   value: status,
//   label: Status[status]
// }));

const desactivateDialog = ref(false);
const selectedBloodBank = ref(null);
const confirmDesactivate = (role) => {
  selectedBloodBank.value = role;
  desactivateDialog.value = true;
};
const desactivate = () => {
  bloodBankStore.toogleStatus(selectedBloodBank.value.id);
  desactivateDialog.value = false;
  selectedBloodBank.value = null;
};

const reactivateDialog = ref(false);
const confirmReactivate = (role) => {
  selectedBloodBank.value = role;
  reactivateDialog.value = true;
};
const reactivate = () => {
  bloodBankStore.toogleStatus(selectedBloodBank.value.id);
  reactivateDialog.value = false;
  selectedBloodBank.value = null;
};
</script>

<template>
  <div class="p-4 card">
    <div class="bloodbanks-title | mb-8">
      <h3>Administración de Bancos de sangre</h3>
    </div>
    <div class="bloodbank-filters-container | mb-8 w-full flex flex-col lg:flex-row">
      <div class="bloodbank-filters | flex flex-wrap gap-2 w-full lg:w-[70%] mb-2 lg:mb-0">
        <div class="bloodbank-filter | w-full md:w-[35%]">
          <FloatLabel variant="on" class="w-full">
            <InputText class="w-full" id="search" v-model="filters.search" aria-describedby="search-help" />
            <label for="search">Nombre</label>
          </FloatLabel>
        </div>
        <div class="bloodbank-filter | w-full md:w-[20%]">
          <FloatLabel variant="on" class="w-full">
            <Select id="id_region" class="w-full" v-model="filters.department" :options="departments" showClear filter @change="onSelectDepartment" :loading="loadingDeparments" />
            <label for="id_region">Departamento</label>
          </FloatLabel>
        </div>
        <div class="bloodbank-filter | w-full md:w-[20%]">
          <FloatLabel variant="on" class="w-full">
            <Select id="id_province" class="w-full" v-model="filters.province" :options="provinces" showClear filter @change="onSelectProvince" :disabled="filters.department === null" :loading="loadingProvinces" />
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
    <div class="btn-new-bloodbank | w-full md:w-[50%] mb-4">
      <Button class="h-8 w-full md:w-[62%] lg:w-[50%] md:max-w-[16rem]" label="Nuevo Banco de Sangre" icon="pi pi-plus" severity="success" />
    </div>
    <DataView :value="bloodBankStore.bloodBanks" layout="grid" paginator :rows="6" :totalRecords="bloodBankStore.totalRecords" @page="filter">
      <template #empty>
        <p class="text-gray-600 text-lg py-4">No encontramos coincidencias. Intenta con otros términos o ajusta los filtros.</p>
      </template>
      <template #grid>
        <div class="grid grid-cols-12 gap-4 py-4">
          <div v-for="(item, index) in bloodBankStore.bloodBanks" :key="index" class="col-span-12 lg:col-span-4 p-4 border border-surface-100 white shadow-[0px_0px_1px_0px_rgba(0,_0,_0,_0.1)] rounded-lg flex flex-col h-full">
            <div class="flex items-center">
              <div class="h-[250px] w-full sm:w-[60%] mr-8 items-center">
                <img src="https://primefaces.org/cdn/primevue/images/product/black-watch.jpg" alt="Banco de sangre" class="h-full w-auto object-cover rounded-lg" />
              </div>
              <div class="h-full w-full sm:grow flex flex-col justify-between">
                <div class="">
                  <h4 class="font-bold">{{ item.name }}</h4>
                  <p><strong>Dirección:</strong> {{ item.address }}</p>
                  <p><strong>Ubicación:</strong> {{ item.location }}</p>
                  <p><strong>Coordinador:</strong> {{ item.coordinator }}</p>
                  <p><strong>Tipo:</strong> {{ item.type }}</p>
                </div>
                <div class="flex gap-2 mt-2 justify-center">
                  <Button label="Editar" class="h-8 w-[6rem] btn-edit" as="router-link" :to="`/admin/blood-banks/${item.id}`" />
                  <Button v-if="item.status === 'ACTIVE'" class="h-8 w-[6rem]" label="Desactivar" severity="danger" @click="confirmDesactivate(item)" />
                  <Button v-else class="h-8 w-[6rem]" label="Activar" severity="success" @click="confirmReactivate(item)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
    <Dialog v-model:visible="desactivateDialog" :style="{ width: '450px' }" header="Desactivar banco de sangre" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="selectedBloodBank">
          ¿Estás seguro de desactivar el banco de sangre <b>{{ selectedBloodBank.name }}</b
          >?
        </span>
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="desactivateDialog = false" />
        <Button label="Desactivar" class="p-button-danger" @click="desactivate" />
      </template>
    </Dialog>

    <Dialog v-model:visible="reactivateDialog" :style="{ width: '450px' }" header="Activar banco de sangre" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="selectedBloodBank">
          ¿Estás seguro de activar el banco de sangre <b>{{ selectedBloodBank.name }}</b
          >?
        </span>
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="reactivateDialog = false" />
        <Button label="Activar" class="p-button-success" @click="reactivate" />
      </template>
    </Dialog>
  </div>
</template>
