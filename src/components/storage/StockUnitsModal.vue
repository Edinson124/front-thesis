<script setup>
import { ref } from 'vue';
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import StockUnits from './StockUnits.vue';

const showConfirmSelected = ref(false);
const unitSelected = ref(false);
const showModal = defineModel({ type: Boolean, required: true });
const emit = defineEmits(['select']);

const close = () => {
  showModal.value = false;
};
defineProps({
  onlySuitable: {
    type: Boolean,
    default: false
  },
  //Default asignar a transfusión
  header: {
    type: String,
    default: '¿Estás seguro asignar esta unidad a la solicitud?'
  },
  message: {
    type: String,
    default: 'La unidad será reservada para la transfusión, si se registra un resultado INCOMPATIBLE posteriormente pasará a estado APTO'
  }
});

const confirmSelect = () => {
  emit('select', unitSelected.value);
  showConfirmSelected.value = false;
  close();
};

const select = (unit) => {
  unitSelected.value = unit;
  showConfirmSelected.value = true;
};
</script>

<template>
  <Dialog v-model:visible="showModal" header="Búsqueda de unidades" modal class="w-[90%] p-4">
    <StockUnits mode="selectable" @select="select" :only-suitable="onlySuitable" />
  </Dialog>
  <ConfirmModal id="selectedUnitStockDialog" v-model="showConfirmSelected" :header="header" :message="message" accept-text="Guardar" @accept="confirmSelect" />
</template>
