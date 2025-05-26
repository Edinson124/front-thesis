<script setup>
import StockUnits from './StockUnits.vue';

const showModal = defineModel({ type: Boolean, required: true });
const emit = defineEmits(['select']);

const close = () => {
  showModal.value = false;
};

const select = (unit) => {
  emit('select', unit);
  close();
};
</script>

<template>
  <Dialog v-model:visible="showModal" header="Búsqueda de unidades" modal class="w-[90%] p-4">
    <StockUnits mode="selectable" @select="select" />
  </Dialog>
</template>
