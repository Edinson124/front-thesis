<!-- BloodStockCards.vue -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

// ✅ Agrupa por Grupo y Rh
const groupedData = computed(() => {
  const grouped = {};
  for (const item of props.data) {
    const key = `${item.bloodType}_${item.rhFactor}`;
    if (!grouped[key]) {
      grouped[key] = {
        key,
        bloodType: item.bloodType,
        rhFactor: item.rhFactor,
        units: []
      };
    }
    grouped[key].units.push({
      unitType: item.unitType,
      quantity: item.quantity
    });
  }
  return Object.values(grouped);
});
</script>

<template>
  <div v-if="groupedData.length > 0" class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    <div v-for="card in groupedData" :key="card.key" class="border rounded-xl p-4 shadow">
      <div class="text-xl font-bold">
        Grupo: <span class="text-blue-600">{{ card.bloodType }}</span> - Rh:
        <span :class="card.rhFactor === 'POSITIVO' ? 'text-red-600' : 'text-gray-600'">
          {{ card.rhFactor }}
        </span>
      </div>
      <table class="w-full text-left mt-2 text-sm">
        <thead>
          <tr class="border-b">
            <th class="pb-1">Tipo de unidad</th>
            <th class="text-right pb-1">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in card.units" :key="item.unitType" class="border-b border-gray-200">
            <td>{{ item.unitType }}</td>
            <td class="text-right font-semibold" :class="item.quantity > 0 ? 'text-green-600' : 'text-gray-500'">
              {{ item.quantity }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-else class="text-center py-6 text-gray-600">No hay datos disponibles para mostrar.</div>
</template>
