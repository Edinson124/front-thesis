<script setup>
import { useUsersStore } from '@/stores/users';
import { Button, FloatLabel, InputText, Select } from 'primevue';
import { onMounted, reactive, ref } from 'vue';

const userStore = useUsersStore();

const loading = ref(false);
const filters = reactive({
  name: '',
  role: '',
  status: ''
});

const roles = reactive([{ name: 'Hematologo' }, { name: 'Administrador' }, { name: 'Coordinador' }, { name: 'Patólogo' }]);
const status = reactive([{ name: 'Activo' }, { name: 'Inactivo' }, { name: 'Eliminado' }]);

const columns = [
  { field: 'id', header: 'Id', width: '5%' },
  { field: 'name', header: 'Nombre Completo', width: '30%' },
  { field: 'email', header: 'Correo', width: '15%' },
  { field: 'phone', header: 'Telefono', width: '10%' },
  { field: 'role', header: 'Rol', width: '15%' },
  { field: 'status', header: 'Estado', width: '10%' }
];

const filterUsers = async (event) => {
  loading.value = true;
  const page = event ? event.page + 1 : userStore.currentPage;
  await userStore.getUsers(filters, page);
  loading.value = false;
};

const resetFilters = () => {
  filters.name = '';
  filters.role = '';
  filters.status = '';
  filterUsers();
};

onMounted(() => {
  filterUsers();
});
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
            <InputText class="w-full" id="username" v-model="filters.name" aria-describedby="username-help" />
            <label for="username">Nombre</label>
          </FloatLabel>
        </div>
        <div class="users-filter | w-full md:w-[23%]">
          <FloatLabel variant="on" class="w-full">
            <Select class="w-full" v-model="filters.role" :options="roles" optionLabel="name" showClear />
            <label for="role">Rol</label>
          </FloatLabel>
        </div>
        <div class="users-filter | w-full md:w-[23%]">
          <FloatLabel variant="on" class="w-full">
            <Select class="w-full" v-model="filters.status" :options="status" optionLabel="name" showClear />
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
      <div class="btn-new | w-full md:w-[50%] mb-4">
        <Button class="h-8 w-full md:w-[50%] md:max-w-[16rem]" label="Nuevo Usuario" icon="pi pi-plus" severity="success" />
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
          <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :style="`width: ${col.width}`"></Column>
          <Column header="Acciones">
            <template #body="">
              <div class="flex flex-wrap w-full">
                <Button class="h-8 w-[6rem] mr-1 my-1 btn-edit" label="Editar" />
                <Button class="h-8 w-[6rem] my-1" label="Eliminar" severity="danger" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
