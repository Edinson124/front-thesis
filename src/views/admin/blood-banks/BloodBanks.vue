<script setup>
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { isInternalOptions } from '@/enums/BloodBank';
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
  isInternal: null,
  status: ''
});

const filter = async (event) => {
  loading.value = true;
  const page = event ? event.page : bloodBankStore.currentPage;
  await bloodBankStore.getBloodBanks(filters, page);
  loading.value = false;
};

const resetFilters = () => {
  filters.name = '';
  filters.region = null;
  filters.province = null;
  filters.district = null;
  filters.isInternal = null;
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

// const statuses = ['ACTIVE', 'INACTIVE'];
// const statusesOptions = statuses.map((status) => ({
//   value: status,
//   label: Status[status]
// }));

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
      <h3>Administración de Bancos de sangre</h3>
    </div>
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-8 space-y-4">
        <!-- Primera fila: 2 elementos en md, 1 en móviles -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FloatLabel variant="on" class="w-full">
              <InputText class="w-full" id="name" v-model="filters.name" aria-describedby="name-help" />
              <label for="name">Nombre</label>
            </FloatLabel>
          </div>
          <div>
            <FloatLabel variant="on" class="w-full">
              <Select class="w-full" id="is_internal" v-model="filters.isInternal" :options="isInternalOptions" optionLabel="label" optionValue="value" showClear aria-describedby="name-help" />
              <label for="is_internal">Acceso</label>
            </FloatLabel>
          </div>
        </div>

        <!-- Segunda fila: 3 elementos en md, 1 en móviles -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FloatLabel variant="on" class="w-full">
              <Select id="id_region" class="w-full" v-model="filters.region" :options="regions" showClear filter @change="onSelectRegion" :loading="loadingRegions" />
              <label for="id_region">Departamento</label>
            </FloatLabel>
          </div>
          <div>
            <FloatLabel variant="on" class="w-full">
              <Select id="id_province" class="w-full" v-model="filters.province" :options="provinces" showClear filter @change="onSelectProvince" :disabled="filters.region === null" :loading="loadingProvinces" />
              <label for="id_province">Provincia</label>
            </FloatLabel>
          </div>
          <div>
            <FloatLabel variant="on" class="w-full">
              <Select id="id_district" class="w-full" v-model="filters.district" :options="distritos" showClear filter :disabled="filters.province === null" :loading="loadingDistritos" />
              <label for="id_district">Distrito</label>
            </FloatLabel>
          </div>
        </div>
      </div>

      <div class="col-span-12 md:col-span-4 flex flex-col md:flex-row md:grow justify-end items-center">
        <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Filtrar" severity="info" @click="filter()" />
        <Button class="h-8 w-full md:grow btn-clean" label="Limpiar" @click="resetFilters()" />
      </div>
    </div>

    <div class="btn-new-bloodbank | w-full mb-4 flex justify-end">
      <Button class="h-8 w-full md:w-[62%] lg:w-[50%] md:max-w-[16rem]" label="Nuevo Banco de Sangre" icon="pi pi-plus" severity="success" as="router-link" to="/admin/blood-banks/new" />
    </div>
    <DataView :value="bloodBankStore.bloodBanks" layout="grid" paginator :rows="6" :totalRecords="bloodBankStore.totalRecords" @page="filter">
      <template #empty>
        <p class="text-gray-600 text-lg py-4">No encontramos coincidencias. Intenta con otros términos o ajusta los filtros.</p>
      </template>
      <template #grid>
        <div class="grid grid-cols-8 gap-4 py-4">
          <div v-for="(item, index) in bloodBankStore.bloodBanks" :key="index" class="col-span-12 lg:col-span-4 p-4 border border-surface-100 white shadow-[0px_0px_1px_0px_rgba(0,_0,_0,_0.1)] rounded-lg flex flex-col h-full">
            <div class="flex items-center">
              <div class="h-[250px] w-full sm:w-[60%] mr-8 items-center">
                <img src="/src/assets/images/blood-bank.png" alt="Banco de sangre" class="h-full w-auto object-cover rounded-lg" />
              </div>
              <div class="h-full w-full sm:grow flex flex-col justify-between">
                <div class="">
                  <h4 class="font-bold">{{ item.name }}</h4>
                  <p><strong>Dirección:</strong> {{ item.address }}</p>
                  <p><strong>Ubicación:</strong> {{ item.region }} / {{ item.province }} /{{ item.district }}</p>
                  <p><strong>Coordinador:</strong> {{ item.fullNameCoordinator }}</p>
                  <p><strong>Tipo:</strong> {{ item.type }}</p>
                  <p>
                    <strong>Acceso:</strong>
                    {{ isInternalOptions.find((opt) => opt.value === item.isInternal)?.label || '-' }}
                  </p>
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
    <!-- <Dialog v-model:visible="desactivateDialog" :style="{ width: '450px' }" header="Desactivar banco de sangre" :modal="true">
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
    </Dialog> -->

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
    <!-- <Dialog v-model:visible="reactivateDialog" :style="{ width: '450px' }" header="Activar banco de sangre" :modal="true">
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
    </Dialog> -->

    <SuccessModal v-model="showSuccessModal" />
    <ErrorModal v-model="showErrorModal" />
  </div>
</template>
