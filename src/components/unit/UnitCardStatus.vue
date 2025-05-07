<script setup>
import { computed } from 'vue';

const props = defineProps({
  codeUnit: Number,
  status: String
});

const STATUS_STYLES = {
  REACTIVO: {
    bgColor: 'bg-red-500',
    icon: 'mdi mdi-close-circle'
  },
  'NO REACTIVO': {
    bgColor: 'bg-green-500',
    icon: 'mdi mdi-check-circle'
  }
};

const statusStyle = computed(() => {
  return (
    STATUS_STYLES[props.status] || {
      bgColor: 'bg-gray-500',
      icon: 'mdi mdi-help-circle'
    }
  );
});
</script>
<template>
  <div :class="['text-white p-4 rounded-md flex items-center', statusStyle.bgColor]">
    <div class="mr-2 mt-1">
      <i :class="[statusStyle.icon, 'text-3xl inline-block']"></i>
    </div>
    <div>
      <div class="font-semibold text-lg">Código de unidad: {{ codeUnit }}</div>
      <div class="font-semibold text-lg">Unidad {{ status === 'REACTIVO' ? 'REACTIVA' : 'APTA' }}</div>

      <!-- <div v-if="enrichedStatus.label === 'Finalizada con diferimiento temporal'" class="text-lg">
        Fecha final de diferimiento: <span class="font-semibold">{{ deferralEndDate }}</span>
      </div>

      <div v-if="enrichedStatus.label === 'Finalizada con diferimiento temporal' || enrichedStatus.label === 'Finalizada con diferimiento permanente'" class="text-lg">
        Motivo del diferimiento: <span class="font-semibold">{{ deferralReason }}</span>
      </div> -->
    </div>
  </div>
</template>
