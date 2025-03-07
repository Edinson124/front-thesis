<script setup>
import { Button, FloatLabel, InputText, Select } from 'primevue';
import { reactive, ref } from 'vue';

const username = ref('');
const selectedRole = ref('');
const selectedStatus = ref('');

const roles = reactive([{ name: 'Hematologo' }, { name: 'Administrador' }, { name: 'Coordinador' }, { name: 'Patólogo' }]);
const status = reactive([{ name: 'Activo' }, { name: 'Inactivo' }, { name: 'Eliminado' }]);

const users = reactive([
    { id: 10000, name: 'Juan Perez', email: 'juan.pperez@gmail.com', phone: 999999999, role: 'Admin', status: 'activo' },
    { id: 2, name: 'Maria López', email: 'maria.lopez@gmail.com', phone: 999111111, role: 'Laboratorista', status: 'activo' },
    { id: 3, name: 'Carlos García', email: 'carlos.garcia@gmail.com', phone: 999222333, role: 'Hematologo', status: 'inactivo' },
    { id: 4, name: 'Ana Torres', email: 'ana.torres@gmail.com', phone: 987987987, role: 'Enfermero', status: 'activo' },
    { id: 5, name: 'Luis Fernández', email: 'luis.fernandez@gmail.com', phone: 987111555, role: 'user', status: 'eliminado' },
    { id: 6, name: 'Elena Ramírez', email: 'elena.ramirez@gmail.com', phone: 987333444, role: 'Patologo', status: 'activo' },
    { id: 7, name: 'Ricardo Mendoza adasd as sdf sd fsd f sd fsd f sd fsd f ds f dasd asdasd asdasd', email: 'ricardo.mendoza@gmail.com', phone: 987333000, role: 'Coordinador', status: 'active' },
    { id: 8, name: 'Gabriela Rojas', email: 'gabriela.rojas@gmail.com', phone: 987333777, role: 'Admin', status: 'inactive' },
    { id: 9, name: 'Javier Castro', email: 'javier.castro@gmail.com', phone: 987000111, role: 'Enfermero', status: 'activo' },
    { id: 10, name: 'Paula Navarro', email: 'paula.navarro@gmail.com', phone: 987323461, role: 'Hematologo', status: 'eliminado' },
    { id: 11, name: 'Paula Navarro', email: 'paula.navarro@gmail.com', phone: 987392817, role: 'Hematologo', status: 'eliminado' }
]);
const columns = [
    { field: 'id', header: 'Id', width: '5%' },
    { field: 'name', header: 'Nombre Completo', width: '30%' },
    { field: 'email', header: 'Correo', width: '15%' },
    { field: 'phone', header: 'Telefono', width: '10%' },
    { field: 'role', header: 'Rol', width: '15%' },
    { field: 'status', header: 'Estado', width: '10%' }
];
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
                        <InputText class="w-full" id="username" v-model="username" aria-describedby="username-help" />
                        <label for="username">Nombre</label>
                    </FloatLabel>
                </div>
                <div class="users-filter | w-full md:w-[23%]">
                    <FloatLabel variant="on" class="w-full">
                        <Select class="w-full" v-model="selectedRole" :options="roles" optionLabel="name" />
                        <label for="role">Rol</label>
                    </FloatLabel>
                </div>
                <div class="users-filter | w-full md:w-[23%]">
                    <FloatLabel variant="on" class="w-full">
                        <Select class="w-full" v-model="selectedStatus" :options="status" optionLabel="name" />
                        <label for="status">Estado</label>
                    </FloatLabel>
                </div>
            </div>
            <div class="users-filters-buttons | flex flex-col md:flex-row md:grow justify-end items-center">
                <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Filtrar" severity="info" />
                <Button class="h-8 w-full md:grow btn-clean" label="Limpiar" />
            </div>
        </div>
        <div class="users-list | w-full">
            <div class="btn-new | w-full md:w-[50%] mb-4">
                <Button class="h-8 w-full md:w-[50%] md:max-w-[16rem]" label="Nuevo Usuario" icon="pi pi-plus" severity="success" />
            </div>
            <div class="users-table">
                <DataTable :value="users" tableStyle="min-width: 50rem" paginator :rows="10" showGridlines>
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
            <div class="users-pagination"></div>
        </div>
    </div>
</template>
