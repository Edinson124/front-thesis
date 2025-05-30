<script setup>
import StockUnits from '@/components/storage/StockUnits.vue';
import { useUnitStore } from '@/stores/storage/units';
import { onMounted } from 'vue';

const unitStore = useUnitStore();
onMounted(async () => {
  await unitStore.getSelectBloodTypesAll();
});
</script>
<template>
  <div class="card">
    <div class="mb-6">
      <h3>Búsqueda de unidades</h3>

      <StockUnits />
    </div>
  </div>
</template>
