<script setup>
import { useDonorStore } from '@/stores/donations/donor';
const donorStore = useDonorStore();
const searchedDonor = donorStore.searchedDonor;
</script>
<template>
  <p v-if="searchedDonor">Nombre del donante: {{ searchedDonor.firstName }} {{ searchedDonor.lastName }} {{ searchedDonor.secondLastName }}</p>
  <p v-else>No se ha buscado ningún donante.</p>
</template>
