<script setup>
defineProps({
  bloodBank: Object
});
</script>
<template>
  <div class="mb-5">
    <Fieldset legend="Datos del banco de sangre" class="mb-6">
      <div v-if="bloodBank" class="space-y-2">
        <div><span class="font-medium">Código de banco:</span> {{ bloodBank.id }}</div>
        <div><span class="font-medium">Dirección:</span> {{ bloodBank.address }}</div>
        <div><span class="font-medium">Ubicación:</span> {{ bloodBank.ubication }}</div>
        <div><span class="font-medium">Coordinador:</span> {{ bloodBank.coordinatorName }}</div>
        <div><span class="font-medium">Tipo de banco de sangre:</span> {{ bloodBank.type }}</div>
      </div>
      <div v-else class="py-4 text-center">
        <i class="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
        <p class="text-gray-700 font-medium">Seleccionad una red y un banco de sangre</p>
      </div>
    </Fieldset>
  </div>
</template>
