<script setup>
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { Status } from '@/enums/Status';
import { useRolesStore } from '@/stores/admin/roles';
import { useUsersStore } from '@/stores/admin/users';
import { Button, FloatLabel, InputText, Select } from 'primevue';
import { onMounted, reactive, ref } from 'vue';

const userStore = useUsersStore();
const rolesStore = useRolesStore();

const loading = ref(false);
const filters = reactive({
  search: '',
  role: '',
  status: ''
});

const columns = [
  { field: 'documentNumber', header: 'N° doc', width: '7%' },
  { field: 'name', header: 'Nombre Completo', width: '24%' },
  { field: 'email', header: 'Correo', width: '15%' },
  { field: 'phone', header: 'Telefono', width: '10%' },
  { field: 'role', header: 'Rol', width: '13%' },
  { field: 'status', header: 'Estado', width: '10%' }
];

const filterUsers = async (event) => {
  loading.value = true;
  const page = event ? event.page + 1 : userStore.currentPage;
  await userStore.getUsers(filters, page);
  loading.value = false;
};

const resetFilters = () => {
  filters.search = '';
  filters.role = '';
  filters.status = '';
  filterUsers();
};

onMounted(async () => {
  await filterUsers();
  await rolesStore.getRolesOptions();
});

const statuses = ['ACTIVE', 'INACTIVE'];
const statusesOptions = statuses.map((status) => ({
  value: status,
  label: Status[status]
}));

const showSuccessModal = ref(false);
const showErrorModal = ref(false);

const desactivateUserDialog = ref(false);
const selectedUser = ref(null);
const confirmDesactivateUser = (user) => {
  selectedUser.value = user;
  desactivateUserDialog.value = true;
};
const desactivateUser = async () => {
  const success = await userStore.toogleStatusUser(selectedUser.value.id);
  if (success) {
    showSuccessModal.value = true;
  } else {
    showErrorModal.value = true;
  }
  selectedUser.value = null;
};

const reactivateUserDialog = ref(false);
const confirmReactivateUser = (user) => {
  selectedUser.value = user;
  reactivateUserDialog.value = true;
};
const reactivateUser = async () => {
  const success = await userStore.toogleStatusUser(selectedUser.value.id);
  if (success) {
    showSuccessModal.value = true;
  } else {
    showErrorModal.value = true;
  }
  selectedUser.value = null;
};
</script>

<template>
  <div class="card">
    <div class="users-title | mb-4">
      <h3>Administración de Usuarios</h3>
    </div>
    <div class="mb-4 w-full flex flex-col md:flex-row">
      <div class="users-filters | flex flex-wrap gap-2 w-full md:w-[70%] mb-2 md:mb-0">
        <div class="users-filter | w-full md:w-1/2">
          <FloatLabel variant="on" class="w-full">
            <InputText class="w-full" id="username" v-model="filters.search" aria-describedby="username" />
            <label for="username">Nombre o N. Documento</label>
          </FloatLabel>
        </div>
        <div class="users-filter | w-full md:w-[23%]">
          <FloatLabel variant="on" class="w-full">
            <Select class="w-full" v-model="filters.role" :options="rolesStore.rolesOptions" optionLabel="name" optionValue="id" showClear />
            <label for="role">Rol</label>
          </FloatLabel>
        </div>
        <div class="users-filter | w-full md:w-[23%]">
          <FloatLabel variant="on" class="w-full">
            <Select class="w-full" v-model="filters.status" :options="statusesOptions" optionLabel="label" optionValue="value" showClear />
            <label for="status">Estado</label>
          </FloatLabel>
        </div>
      </div>
      <div class="users-filters-buttons | flex flex-col md:flex-row md:grow justify-end items-center">
        <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Filtrar" severity="info" @click="filterUsers()" />
        <Button class="h-8 w-full md:grow btn-clean" label="Limpiar" @click="resetFilters()" />
      </div>
    </div>
    <div class="users-list | w-full">
      <div class="btn-new | w-full mb-4 flex justify-end">
        <Button class="h-8 w-full md:w-[50%] md:max-w-[16rem]" label="Nuevo Usuario" icon="pi pi-plus" severity="success" as="router-link" to="/admin/users/new" />
      </div>
      <div class="users-table">
        <DataTable
          :value="userStore.users"
          tableStyle="min-width: 50rem"
          paginator
          :rows="10"
          :totalRecords="userStore.totalRecords"
          lazy
          :loading="loading"
          showGridlines
          @page="filterUsers"
          :currentPageReportTemplate="'{currentPage} de {totalPages}'"
        >
          <template #empty>
            <p class="text-gray-600 text-lg py-4">No encontramos coincidencias. Intenta con otros términos o ajusta los filtros.</p>
          </template>

          <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :style="`width: ${col.width}`">
            <template v-if="col.field === 'name'" #body="slotProps"> {{ slotProps.data.firstName }} {{ slotProps.data.lastName }} {{ slotProps.data.secondLastName }} </template>
            <template v-else-if="col.field === 'status'" #body="slotProps"> {{ Status[slotProps.data.status] }} </template>
          </Column>
          <Column header="Acciones">
            <template #body="slotProps">
              <div class="flex flex-wrap w-full">
                <Button class="h-8 w-[6rem] mr-1 my-1 btn-edit" label="Editar" as="router-link" :to="`/admin/users/${slotProps.data.id}`" />
                <Button v-if="slotProps.data.status === 'ACTIVE'" class="h-8 w-[6rem] my-1" label="Desactivar" severity="danger" @click="confirmDesactivateUser(slotProps.data)" />
                <Button v-else class="h-8 w-[6rem] my-1" label="Activar" severity="success" @click="confirmReactivateUser(slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <ConfirmModal
        id="desactivateUserDialog"
        v-model="desactivateUserDialog"
        severity="warn"
        header="Desactivar usuario"
        :message="`¿Estás seguro de desactivar a ${selectedUser?.firstName} ${selectedUser?.lastName}?`"
        accept-text="Desactivar"
        accept-button-class="p-button-danger"
        @accept="desactivateUser"
      />
      <!-- <Dialog v-model:visible="desactivateUserDialog" :style="{ width: '450px' }" header="Desactivar usuario" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="selectedUser">
            ¿Estás seguro de desactivar a <b>{{ selectedUser.firstName }}</b
            >?
          </span>
        </div>
        <template #footer>
          <Button label="Cancelar" text @click="desactivateUserDialog = false" />
          <Button label="Desactivar" class="p-button-danger" @click="desactivateUser" />
        </template>
      </Dialog> -->

      <ConfirmModal
        id="reactivateUserDialog"
        v-model="reactivateUserDialog"
        severity="warn"
        header="Activar usuario"
        :message="`¿Estás seguro de activar a ${selectedUser?.firstName} ${selectedUser?.lastName}?`"
        accept-text="Activar"
        accept-button-class="p-button-success"
        @accept="reactivateUser"
      />
      <!-- <Dialog v-model:visible="reactivateUserDialog" :style="{ width: '450px' }" header="Activar usuario" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="selectedUser">
            ¿Estás seguro de activar a <b>{{ selectedUser.firstName }}</b
            >?
          </span>
        </div>
        <template #footer>
          <Button label="Cancelar" text @click="reactivateUserDialog = false" />
          <Button label="Activar" class="p-button-success" @click="reactivateUser" />
        </template>
      </Dialog> -->

      <SuccessModal v-model="showSuccessModal" message="El usuario fue guardado con éxito" />
      <ErrorModal v-model="showErrorModal" />
    </div>
  </div>
</template>
