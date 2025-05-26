<script setup>
import StockUnits from '@/components/storage/StockUnits.vue';
import { onMounted } from 'vue';

onMounted(async () => {});
</script>
<template>
  <div class="card">
    <div class="mb-6">
      <h3>Búsqueda de unidades</h3>

      <StockUnits />
    </div>
  </div>
</template>
