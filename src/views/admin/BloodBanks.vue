<script setup>
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { reactive, ref, watchEffect } from 'vue';

const banks = ref([
  {
    id: '104490',
    name: 'BANCO DE SANGRE DE TRUJILLO',
    address: 'Av. Los Conquistadores del Ejército de Chavín 133',
    location: 'LA LIBERTAD / TRUJILLO / TRUJILLO',
    coordinator: 'Juan Medrano Suarez',
    type: 'IA'
  },
  {
    id: '204591',
    name: 'BANCO DE SANGRE DE LIMA',
    address: 'Av. Ejemplo 123',
    location: 'LIMA / LIMA / MIRAFLORES',
    coordinator: 'Ana López',
    type: 'IB'
  },
  {
    id: '204591',
    name: 'BANCO DE SANGRE DE LIMAefwefwe',
    address: 'Av. Ejemplo 123',
    location: 'LA LIBERTAD / TRUJILLO / TRUJILLO',
    coordinator: 'Ana López',
    type: 'IB'
  }
]);

const filters = ref({
  name: '',
  department: null,
  province: null,
  district: null
});
const filteredBanks = ref([...banks.value]); // Se inicializa con todos los bancos

const departments = reactive(['LA LIBERTAD', 'LIMA']);
const provinces = reactive(['TRUJILLO', 'LIMA']);
const districts = reactive(['TRUJILLO', 'MIRAFLORES']);

const applyFilters = () => {
  filteredBanks.value = banks.value.filter((bank) => {
    return (
      (!filters.value.name || bank.name.toLowerCase().includes(filters.value.name.toLowerCase())) &&
      (!filters.value.department || bank.location.includes(filters.value.department)) &&
      (!filters.value.province || bank.location.includes(filters.value.province)) &&
      (!filters.value.district || bank.location.includes(filters.value.district))
    );
  });
};

const clearFilters = () => {
  filters.value.name = '';
  filters.value.department = null;
  filters.value.province = null;
  filters.value.district = null;
  filteredBanks.value = [...banks.value]; // Reiniciar la lista
};

watchEffect(() => {
  console.log('Bancos filtrados:', filteredBanks.value);
});
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
            <InputText class="w-full" id="name" v-model="filters.name" aria-describedby="name-help" />
            <label for="name">Nombre</label>
          </FloatLabel>
        </div>
        <div class="bloodbank-filter | w-full md:w-[20%]">
          <FloatLabel variant="on" class="w-full">
            <Select class="w-full" v-model="filters.department" :options="departments" />
            <label for="role">Departamento</label>
          </FloatLabel>
        </div>
        <div class="bloodbank-filter | w-full md:w-[20%]">
          <FloatLabel variant="on" class="w-full">
            <Select class="w-full" v-model="filters.province" :options="provinces" />
            <label for="status">Provincia</label>
          </FloatLabel>
        </div>
        <div class="bloodbank-filter | w-full md:w-[20%]">
          <FloatLabel variant="on" class="w-full">
            <Select class="w-full" v-model="filters.district" :options="districts" />
            <label for="status">Distrito</label>
          </FloatLabel>
        </div>
      </div>
      <div class="bloodbank-filters-buttons | flex flex-col md:flex-row md:grow justify-end items-center">
        <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Filtrar" severity="info" @click="applyFilters" />
        <Button class="h-8 w-full md:grow btn-clean" label="Limpiar" @click="clearFilters" />
      </div>
    </div>
    <div class="btn-new-bloodbank | w-full md:w-[50%] mb-4">
      <Button class="h-8 w-full md:w-[62%] lg:w-[50%] md:max-w-[16rem]" label="Nuevo Banco de Sangre" icon="pi pi-plus" severity="success" />
    </div>
    <DataView :value="filteredBanks" layout="grid" paginator :rows="10">
      <template #grid>
        <div class="grid grid-cols-12 gap-4">
          <div v-for="(item, index) in filteredBanks" :key="index" class="col-span-12 lg:col-span-6 p-3 border border-surface-200 white shadow-lg rounded-lg flex flex-col h-full">
            <div class="flex flex-wrap grow items-center">
              <div class="w-full sm:w-[48%] mr-2 items-center">
                <img src="https://primefaces.org/cdn/primevue/images/product/black-watch.jpg" alt="Banco de sangre" class="w-full sm:w-[80%] object-cover rounded-lg mr-0 sm:mr-4" />
              </div>
              <div class="w-full sm:w-[48%] flex flex-col justify-between p-2">
                <div class="">
                  <h4 class="font-bold">{{ item.name }}</h4>
                  <p><strong>Dirección:</strong> {{ item.address }}</p>
                  <p><strong>Ubicación:</strong> {{ item.location }}</p>
                  <p><strong>Coordinador:</strong> {{ item.coordinator }}</p>
                  <p><strong>Tipo:</strong> {{ item.type }}</p>
                </div>
                <div class="flex gap-2 mt-2 mb-2 justify-center">
                  <Button label="Editar" class="h-8 w-24 btn-edit" />
                  <Button label="Eliminar" class="h-8 w-24" severity="danger" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>
