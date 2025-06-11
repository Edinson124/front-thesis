<script setup>
import { getStringFormatAge } from '@/utils/date';
import { computed } from 'vue';
const props = defineProps({
  patient: Object,
  isEditable: Boolean
});

const years = computed(() => {
  if (props.patient && props.patient.birthDate) {
    return getStringFormatAge(props.patient.birthDate);
  }
  return null;
});
</script>

<template>
  <div>
    <!-- Información del Donante -->
    <div>
      <div>
        <div class="mb-2"><span class="font-medium">Identificación: </span> {{ patient.documentType }} - {{ patient.documentNumber }}</div>
        <div>
          <div class="mb-2"><span class="font-medium">Nombres y Apellidos: </span> {{ patient.firstName }} {{ patient.lastName }} {{ patient.secondLastName }}</div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-11 md:gap-y-3 gap-x-6">
          <div class="mb-2 md:col-span-7"><span class="font-medium">Fecha de nacimiento: </span> {{ patient.birthDate }} - {{ years }}</div>
          <div class="mb-2 md:col-span-4"><span class="font-medium">Sexo: </span> {{ patient.gender }}</div>
        </div>
        <div>
          <div class="mb-2"><span class="font-medium">Domicilio: </span> {{ patient.address }} - {{ patient.region }} - {{ patient.province }} - {{ patient.district }}</div>
        </div>
        <!-- <div class="grid grid-cols-1 md:grid-cols-11 md:gap-y-3 gap-x-6">
          <div class="mb-2 md:col-span-7"><span class="font-medium">Ocupación: </span> {{ patient.occupation || '-' }}</div>
          <div class="mb-2 md:col-span-4"><span class="font-medium">Estado civil: </span> {{ patient.maritalStatus || '-' }}</div>
        </div> -->
        <div class="grid grid-cols-1 md:grid-cols-11 md:gap-y-3 gap-x-6">
          <div class="mb-2 md:col-span-7"><span class="font-medium">Email: </span> {{ patient.email || '-' }}</div>
          <div class="mb-2 md:col-span-4"><span class="font-medium">Teléfono: </span> {{ patient.phone || '-' }}</div>
        </div>
        <div>
          <div class="mb-2"><span class="font-medium">Alergías: </span> {{ patient.allergic || '-' }}</div>
        </div>
      </div>

      <!-- Botón de editar, solo visible si isEditable es true -->
      <div v-if="isEditable" class="flex justify-end mt-4">
        <Button label="Editar" class="h-8 w-[6rem] btn-edit" as="router-link" :to="`/transfusion/patient/${patient.documentType}/${patient.documentNumber}/edit`" />
      </div>
    </div>
  </div>
</template>
