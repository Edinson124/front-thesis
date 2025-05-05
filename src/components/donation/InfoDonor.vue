<script setup>
import { getStringFormatAge } from '@/utils/date';
import { computed } from 'vue';
const props = defineProps({
  donor: Object,
  isEditable: Boolean
});

const years = computed(() => {
  if (props.donor && props.donor.birthDate) {
    return getStringFormatAge(props.donor.birthDate);
  }
  return null;
});
</script>

<template>
  <div>
    <!-- Información del Donante -->
    <div>
      <div>
        <div class="mb-2"><span class="font-medium">Identificación: </span> {{ donor.documentType }} - {{ donor.documentNumber }}</div>
        <div>
          <div class="mb-2"><span class="font-medium">Nombres y Apellidos: </span> {{ donor.firstName }} {{ donor.lastName }} {{ donor.secondLastName }}</div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-11 md:gap-y-3 gap-x-6">
          <div class="mb-2 md:col-span-7"><span class="font-medium">Fecha de nacimiento: </span> {{ donor.birthDate }} - {{ years }}</div>
          <div class="mb-2 md:col-span-4"><span class="font-medium">Sexo: </span> {{ donor.gender }}</div>
        </div>
        <div>
          <div class="mb-2"><span class="font-medium">Domicilio: </span> {{ donor.address }} - {{ donor.region }} - {{ donor.province }} - {{ donor.district }}</div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-11 md:gap-y-3 gap-x-6">
          <div class="mb-2 md:col-span-7"><span class="font-medium">Ocupación: </span> {{ donor.occupation || '-' }}</div>
          <div class="mb-2 md:col-span-4"><span class="font-medium">Estado civil: </span> {{ donor.maritalStatus || '-' }}</div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-11 md:gap-y-3 gap-x-6">
          <div class="mb-2 md:col-span-7"><span class="font-medium">Email: </span> {{ donor.email || '-' }}</div>
          <div class="mb-2 md:col-span-4"><span class="font-medium">Teléfono: </span> {{ donor.phone || '-' }}</div>
        </div>
      </div>

      <!-- Botón de editar, solo visible si isEditable es true -->
      <div v-if="isEditable" class="flex justify-end mt-4">
        <Button label="Editar" class="h-8 w-[6rem] btn-edit" as="router-link" :to="`/donation/donor/${donor.documentType}/${donor.documentNumber}/edit`" />
      </div>
    </div>
  </div>
</template>
