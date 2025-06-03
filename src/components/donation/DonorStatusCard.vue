<script setup>
import { DonorStatus } from '@/enums/Status';
import { computed } from 'vue';

const props = defineProps({
  documentNumber: String,
  status: String,
  deferralEndDate: String,
  deferralReason: String,
  gender: String,
  lastDonationDate: String,
  dateEnabled: String,
  requiredAdvertisement: Boolean
});

const STATUS_STYLES = {
  Apto: {
    bgColor: 'bg-green-500',
    icon: 'mdi mdi-check-circle'
  },
  AptoAdvertencia: {
    bgColor: 'bg-yellow-500',
    icon: 'mdi mdi-alert-circle'
  },
  'Diferido Temporalmente': {
    bgColor: 'bg-yellow-500',
    icon: 'mdi mdi-alert-circle'
  },
  'Diferido Permanentemente': {
    bgColor: 'bg-red-500',
    icon: 'mdi mdi-close-circle'
  }
};

const enrichedStatus = computed(() => {
  return DonorStatus[props.status] || { label: props.status, enableToNewDonation: false };
});

// function necesitaAdvertenciaPorDonacion() {
//   if (props.status !== 'Apto' || !props.lastDonationDate || !props.gender) return false;

//   const generoConfig = Gender[props.gender];

//   if (!generoConfig || !generoConfig.minMonthsBetweenDonations) return false;

//   const [day, month, year] = props.lastDonationDate.split('/');
//   const ultima = new Date(year, month - 1, day);
//   const hoy = new Date();
//   let diferenciaMeses = (hoy.getFullYear() - ultima.getFullYear()) * 12 + hoy.getMonth() - ultima.getMonth();
//   if (hoy.getDate() < ultima.getDate()) diferenciaMeses--;

//   return diferenciaMeses < generoConfig.minMonthsBetweenDonations;
// }

const statusStyle = computed(() => {
  if (props.status === 'Apto' && props.requiredAdvertisement) {
    return STATUS_STYLES['AptoAdvertencia'];
  }
  return (
    STATUS_STYLES[props.status] || {
      bgColor: 'bg-gray-500',
      icon: 'mdi mdi-help-circle'
    }
  );
});
</script>
<template>
  <div :class="['text-white p-4 rounded-md mb-4 flex items-center', statusStyle.bgColor]">
    <div class="mr-2 mt-1">
      <i :class="[statusStyle.icon, 'text-3xl inline-block']"></i>
    </div>
    <div>
      <div class="font-semibold text-lg">Documento del donante: {{ documentNumber }}</div>
      <div class="font-semibold text-lg">Estado del donante: {{ enrichedStatus.label }}</div>

      <div v-if="enrichedStatus.label === 'Diferido Temporalmente'" class="text-lg">
        Fecha final de diferimiento: <span class="font-semibold">{{ deferralEndDate }}</span>
      </div>

      <div v-if="enrichedStatus.label === 'Diferido Temporalmente' || enrichedStatus.label === 'Diferido Permanentemente'" class="text-lg">
        Motivo del diferimiento: <span class="font-semibold">{{ deferralReason }}</span>
      </div>

      <div v-if="enrichedStatus.label === 'Apto' && props.requiredAdvertisement" class="text-lg">
        Fecha de última donación: <span class="font-semibold">{{ lastDonationDate }} </span> — Próxima fecha disponible: <span class="font-semibold">{{ dateEnabled }}</span>
      </div>
    </div>
  </div>
</template>
