<script setup>
import { RhFactor } from '@/enums/BloodType';
defineProps({
  transfusion: Object
});
</script>
<template>
  <Fieldset legend="Datos de la solicitud de tranfusión" class="mb-2">
    <div class="rounded-md px-5 pt-5 pb-2 bg-white">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Columna izquierda -->
        <div class="space-y-2">
          <div class="flex">
            <div class="mr-2">Fecha y hora de solicitud:</div>
            <div>{{ transfusion.date }}</div>
          </div>

          <div class="flex">
            <div class="mr-2">Médico solicitante:</div>
            <div>{{ transfusion.attendingDoctorName }}</div>
          </div>

          <div class="flex">
            <div class="mr-2">Documento paciente:</div>
            <div>{{ transfusion.patientDocumentType }} - {{ transfusion.patientDocumentNumber }}</div>
          </div>

          <div class="flex">
            <div class="font-medium w-28">Paciente:</div>
            <div>{{ transfusion.patientName }}</div>
          </div>

          <div class="flex">
            <div class="font-medium w-28">Cama:</div>
            <div>{{ transfusion.bed }}</div>
          </div>

          <div class="flex">
            <div class="font-medium w-28">Servicio:</div>
            <div>{{ transfusion.medicalService }}</div>
          </div>

          <div class="flex">
            <div class="font-medium mr-2">Prueba cruzada:</div>
            <div>{{ transfusion.hasCrossmatch ? 'SI' : 'NO' }}</div>
          </div>
        </div>

        <!-- Columna derecha -->
        <div class="flex flex-col">
          <div class="text-xl mb-2 font-medium">Grupo sanguíneo</div>
          <div class="text-4xl font-bold">{{ transfusion.patientBloodType }}</div>
          <div class="text-xl font-semibold">Rh {{ RhFactor[transfusion.patientRhFactor]?.label }}</div>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 mt-2">
        <div class="flex">
          <div class="font-medium w-28 shrink-0">Motivo:</div>
          <div>{{ transfusion.requestReason || '-' }}</div>
        </div>
        <div class="flex items-start">
          <div class="font-medium w-28 shrink-0">Diagnóstico:</div>
          <div>{{ transfusion.diagnosis || '-' }}</div>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <Button label="Editar" class="h-8 w-[6rem] btn-edit" as="router-link" :to="`/transfusion/${transfusion.id}`" />
    </div>
  </Fieldset>
</template>
