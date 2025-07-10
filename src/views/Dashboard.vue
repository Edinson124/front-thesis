<script setup>
import { useBloodStorageStore } from '@/stores/storage/bloodStorage';
import { computed, onMounted, ref } from 'vue';

const bloodStorageStore = useBloodStorageStore();
const loading = ref(false);
const bloodStorageData = ref({});

// Objeto de traducción
const UnitTypesTranslate = {
  'Sangre total': 'totalBlood',
  'Concentrado de eritrocitos': 'erythrocyteConcentrate',
  'Plasma fresco congelado': 'freshFrozenPlasma',
  Crioprecipitados: 'cryoprecipitate',
  Plaquetas: 'platelet',
  'Aféresis de plaquetas': 'plateletApheresis',
  'Aféresis de glóbulos rojos': 'redBloodCellsApheresis',
  'Aféresis de plasma': 'plasmaApheresis'
};

// Computed para procesar los datos
const processedBloodData = computed(() => {
  const result = [];

  for (const [spanishName, englishKey] of Object.entries(UnitTypesTranslate)) {
    const quantity = bloodStorageData.value[englishKey] || 0;

    result.push({
      name: spanishName,
      quantity: quantity,
      status: quantity === 0 ? 'empty' : 'available'
    });
  }

  return result;
});

onMounted(async () => {
  loading.value = true;
  try {
    const bloodStorageResponse = await bloodStorageStore.getBloodStorage();
    bloodStorageData.value = bloodStorageResponse;
  } catch (error) {
    console.error('Error al obtener datos de almacenamiento:', error);
  } finally {
    loading.value = false;
  }
});

// Función para obtener el texto de estado
const getStatusText = (item) => {
  if (item.status === 'empty') {
    return 'Sin existencias';
  } else {
    return `${item.quantity} disponibles`;
  }
};

// Función para obtener el color del texto de estado
const getStatusColor = (status) => {
  switch (status) {
    case 'deficit':
      return 'text-red-500';
    case 'empty':
      return 'text-orange-500';
    default:
      return 'text-primary';
  }
};
</script>

<template>
  <div class="card p-6">
    <h1 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-0">Inventario de Unidades de Sangre Aptas</h1>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-4xl text-primary mb-4"></i>
        <p class="text-muted-color">Cargando datos del inventario...</p>
      </div>
    </div>

    <!-- Data display -->
    <div v-else class="grid grid-cols-12 gap-6">
      <div v-for="item in processedBloodData" :key="item.name" class="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 border rounded-xl p-4 shadow">
        <div class="card mb-0 h-full">
          <div class="flex justify-between mb-4">
            <div class="flex-1">
              <span class="block text-muted-color font-medium mb-4">
                {{ item.name }}
              </span>
              <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                {{ item.quantity }}
              </div>
            </div>
          </div>

          <div class="text-sm">
            <span class="font-medium" :class="getStatusColor(item.status)">
              {{ getStatusText(item) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && processedBloodData.length === 0" class="text-center py-8">
      <i class="pi pi-exclamation-triangle text-4xl text-orange-500 mb-4"></i>
      <p class="text-muted-color">No se pudieron cargar los datos del inventario</p>
    </div>
  </div>
</template>
