<script setup>
defineProps({
  donation: Object,
  isEditable: Boolean
});
</script>

<template>
  <div>
    <!-- Información del Donante -->
    <div>
      <div>
        <div class="grid grid-cols-1 md:grid-cols-4 md:gap-y-3 gap-x-6">
          <div class="mb-2 md:col-span-2"><span class="font-medium">Tipo de donante: </span> {{ donation.donationPurpose }}</div>
          <div class="mb-2 md:col-span-2"><span class="font-medium">Componente a donar: </span> {{ donation.bloodComponent }}</div>
        </div>
        <div>
          <div class="mb-2">
            <span class="font-medium">Paciente: </span>
            {{ donation.patientDocumentNumber ? `${donation.patientDocumentType} - ${donation.patientDocumentNumber} - ${donation.patientFullName}` : '-' }}
          </div>
        </div>
        <div>
          <div class="mb-2"><span class="font-medium">Fecha de donación: </span> {{ donation.date }}</div>
        </div>
        <div>
          <div class="mb-2">
            <span class="font-medium">Observaciones: </span>
            {{ donation.observation ?? '-' }}
          </div>
        </div>
      </div>

      <!-- Botón de editar, solo visible si isEditable es true -->
      <div v-if="isEditable" class="flex justify-end mt-2">
        <Button label="Editar" class="h-8 w-[6rem] btn-edit" />
      </div>
    </div>
  </div>
</template>
