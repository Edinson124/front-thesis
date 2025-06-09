<script setup>
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { Role } from '@/enums/Role';
import { Status } from '@/enums/Status';
import { useRolesStore } from '@/stores/admin/roles';
import { Button, FloatLabel, InputText, Select } from 'primevue';
import { onMounted, reactive, ref } from 'vue';

const rolesStore = useRolesStore();

const loading = ref(false);
const filters = reactive({
  search: '',
  status: ''
});

const columns = [
  { field: 'id', header: 'Id', width: '5%' },
  { field: 'name', header: 'Rol', width: '30%' },
  { field: 'status', header: 'Estado', width: '10%' }
];

const filter = async (event) => {
  loading.value = true;
  const page = event ? event.page : rolesStore.currentPage;
  await rolesStore.getRoles(filters, page);
  loading.value = false;
};

const resetFilters = () => {
  filters.search = '';
  filters.status = '';
  filter();
};

onMounted(async () => {
  await filter();
});

const statuses = ['ACTIVE', 'INACTIVE'];
const statusesOptions = statuses.map((status) => ({
  value: status,
  label: Status[status]
}));

const showSuccessModal = ref(false);
const showErrorModal = ref(false);

const desactivateDialog = ref(false);
const selectedRole = ref(null);
const confirmDesactivate = (role) => {
  selectedRole.value = role;
  desactivateDialog.value = true;
};
const desactivate = async () => {
  const success = await rolesStore.toogleStatus(selectedRole.value.id);
  if (success) {
    showSuccessModal.value = true;
  } else {
    showErrorModal.value = true;
  }
  selectedRole.value = null;
};

const reactivateDialog = ref(false);
const confirmReactivate = (role) => {
  selectedRole.value = role;
  reactivateDialog.value = true;
};
const reactivate = async () => {
  const success = await rolesStore.toogleStatus(selectedRole.value.id);
  if (success) {
    showSuccessModal.value = true;
  } else {
    showErrorModal.value = true;
  }
  selectedRole.value = null;
};
</script>

<template>
  <div class="card">
    <div class="mb-4">
      <h3>Administración de Roles</h3>
    </div>
    <div class="mb-4 w-full flex flex-col md:flex-row">
      <div class="flex flex-wrap gap-2 w-full md:w-[70%] mb-2 md:mb-0">
        <div class="w-full md:w-1/2">
          <FloatLabel variant="on" class="w-full">
            <InputText class="w-full" id="search" v-model="filters.search" aria-describedby="search" />
            <label for="search">Nombre</label>
          </FloatLabel>
        </div>
        <div class="w-full md:w-[23%]">
          <FloatLabel variant="on" class="w-full">
            <Select class="w-full" v-model="filters.status" :options="statusesOptions" optionLabel="label" optionValue="value" showClear />
            <label for="status">Estado</label>
          </FloatLabel>
        </div>
      </div>
      <div class="flex flex-col md:flex-row md:grow justify-end items-center">
        <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Filtrar" severity="info" @click="filter()" />
        <Button class="h-8 w-full md:grow btn-clean" label="Limpiar" @click="resetFilters()" />
      </div>
    </div>
    <div class="w-full">
      <DataTable :value="rolesStore.roles" tableStyle="min-width: 50rem" paginator :rows="10" :totalRecords="rolesStore.totalRecords" lazy :loading="loading" showGridlines @page="filter" :currentPageReportTemplate="'{currentPage} de {totalPages}'">
        <template #empty>
          <p class="text-gray-600 text-lg py-4">No encontramos coincidencias. Intenta con otros términos o ajusta los filtros.</p>
        </template>

        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :style="`width: ${col.width}`">
          <template v-if="col.field === 'status'" #body="slotProps"> {{ Status[slotProps.data.status] }} </template>
        </Column>
        <Column header="Acciones">
          <template #body="slotProps">
            <div class="flex flex-wrap w-full">
              <!-- <Button class="h-8 w-[6rem] mr-1 my-1 btn-edit" label="Editar" as="router-link" :to="`/admin/roles/${slotProps.data.id}`" /> -->
              <Button v-if="slotProps.data.name === 'ADMIN'" class="h-8 w-[6rem] mr-1 my-1" label="Editar" disabled />
              <Button v-else-if="slotProps.data.status === 'ACTIVE'" n class="h-8 w-[6rem] mr-1 my-1 btn-edit" label="Editar" as="router-link" :to="`/admin/roles/${slotProps.data.id}`" />
              <Button v-if="slotProps.data.name === 'ADMIN'" class="h-8 w-[6rem] my-1" label="Desactivar" disabled />
              <Button v-else-if="slotProps.data.status === 'ACTIVE'" class="h-8 w-[6rem] my-1" label="Desactivar" severity="danger" @click="confirmDesactivate(slotProps.data)" />
              <Button v-else class="h-8 w-[6rem] my-1" label="Activar" severity="success" @click="confirmReactivate(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>

      <ConfirmModal
        id="desactivateDialog"
        v-model="desactivateDialog"
        severity="warn"
        header="Desactivar rol"
        :message="`¿Estás seguro de desactivar al rol ${Role[selectedRole?.name]}?`"
        accept-text="Desactivar"
        accept-button-class="p-button-danger"
        @accept="desactivate"
      />
      <!-- <Dialog v-model:visible="desactivateDialog" :style="{ width: '450px' }" header="Desactivar rol" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="selectedRole">
            ¿Estás seguro de desactivar al rol <b>{{ Role[selectedRole.name] }}</b
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
        header="Activar rol"
        :message="`¿Estás seguro de activar al rol ${Role[selectedRole?.name]}?`"
        accept-text="Activar"
        accept-button-class="p-button-success"
        @accept="reactivate"
      />
      <!-- <Dialog v-model:visible="reactivateDialog" :style="{ width: '450px' }" header="Activar rol" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="selectedRole">
            ¿Estás seguro de activar al rol <b>{{ Role[selectedRole.name] }}</b
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
  </div>
</template>
