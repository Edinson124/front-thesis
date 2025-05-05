<script setup></script>

<template>
  <div v-if="isEnableDonationToStatus">
    <!-- Si ya existe una donación activa, muestra el mensaje -->
    <div v-if="actuadlDonationId != null" class="text-center py-10">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl">Nueva Donación</h2>
      </div>
      <div>
        <p class="text-lg font-semibold text-red-600 mb-2">Ya existe una donación en proceso.</p>
        <p class="text-gray-700">
          Código de la donación: <span class="font-bold">{{ actuadlDonationId }}</span>
        </p>
      </div>
      <div class="flex justify-end mt-4 gap-2">
        <Button class="min-w-40 btn-clean" label="Cancelar" @click="cancelSave" />
      </div>
    </div>
    <!-- Sección de Donaciones -->
    <div v-else-if="canDonateDateLastDonation">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl">Nueva Donación</h2>
      </div>

      <div class="border border-gray-300 rounded-md p-5 bg-white mb-6">
        <form @submit.prevent="saveDonation">
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FloatLabel variant="on">
                  <Select id="donationPurpose" v-model="donation.donationPurpose" :options="donorTypesOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.donationPurpose?.$error" />
                  <label for="donationPurpose">Tipo de donante</label>
                </FloatLabel>
                <Message v-if="v$.donationPurpose?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.donationPurpose.$errors[0].$message }}</Message>
              </div>
              <div>
                <FloatLabel variant="on">
                  <Select id="bloodComponent" v-model="donation.bloodComponent" :options="componentDonationOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.bloodComponent?.$error" />
                  <label for="bloodComponent">Componente donado</label>
                </FloatLabel>
                <Message v-if="v$.bloodComponent?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.bloodComponent.$errors[0].$message }}</Message>
              </div>
            </div>
          </div>

          <!-- Paciente asignado -->
          <div class="mb-6" v-if="requiresPaciente">
            <h3 class="text-base mb-4">Paciente asignado (en caso requiera)</h3>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-center">
              <div class="md:col-span-3">
                <FloatLabel variant="on">
                  <Select
                    id="documentTypePatient"
                    v-model="donation.documentTypePatient"
                    :options="documentTypesPatientOptions"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                    :disabled="isSameDonor"
                    :invalid="v$.documentTypePatient?.$error"
                  />
                  <label for="documentTypePatient">Tipo Documento</label>
                </FloatLabel>
                <Message v-if="v$.documentTypePatient?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.documentTypePatient.$errors[0].$message }}</Message>
              </div>
              <div class="md:col-span-3">
                <div class="flex">
                  <span class="w-full mr-2">
                    <FloatLabel variant="on">
                      <InputText id="documentNumberPatient" v-model="donation.documentNumberPatient" class="w-full" :disabled="isSameDonor" :invalid="v$.documentNumberPatient?.$error" />
                      <label for="documentNumberPatient">Nro Documento</label>
                    </FloatLabel>
                    <Message v-if="v$.documentNumberPatient?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.documentNumberPatient.$errors[0].$message }}</Message>
                  </span>
                </div>
              </div>
              <div class="md:col-span-2">
                <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Validar" severity="info" @click="validatePatient()" />
              </div>
            </div>

            <div class="mb-4" v-if="pacienteBuscado">
              <div v-if="pacienteEncontrado" class="mb-2"><span class="font-medium">Nombre del paciente:</span> {{ nombrePaciente }}</div>
              <div v-else class="mb-2 text-red-600">
                <span class="font-medium">Nombre del paciente:</span>
                Paciente no encontrado con documento {{ tipoDocumentoPacienteBuscado || '' }} - {{ numeroDocumentoPacienteBuscado }}
              </div>
            </div>
          </div>

          <!-- Observaciones -->
          <div class="mb-6">
            <FloatLabel variant="on">
              <Textarea id="observation" v-model="donation.observation" rows="5" class="w-full resize-none" />
              <label for="observation">Observacioness</label>
            </FloatLabel>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-end mt-4 gap-2">
            <Button class="min-w-40 btn-clean" label="Cancelar" @click="cancelSave" />
            <Button class="min-w-40 p-button-success" label="Guardar" type="submit" />
          </div>
        </form>
      </div>
    </div>
    <div v-else>
      <div class="flex justify-end mt-4 gap-2">
        <Button class="min-w-40 btn-clean" label="Cancelar" @click="cancelSave" />
      </div>
    </div>
  </div>
  <div v-else>
    <div class="flex justify-end mt-4 gap-2">
      <Button class="min-w-40 btn-clean" label="Cancelar" @click="cancelSave" />
    </div>
  </div>
  <Dialog v-model:visible="showModalDocument" header="Validación de documento de paciente" :modal="true" :closable="false" width="400px">
    <p>No se ha encontrado un paciente con el documento ingresado.</p>
    <template #footer>
      <Button label="Aceptar" severity="danger" @click="closeModal" />
    </template>
  </Dialog>
  <Dialog v-model:visible="showSuccessModal" header="Donación creada" modal class="w-[30rem]">
    <p>
      Se ha creado la donación exitosamente.<br />
      El código de la donación es: <strong>{{ createdDonationId }}</strong>
    </p>
    <template #footer>
      <Button label="Aceptar" class="min-w-40 p-button-success" @click="confirmSuccess" autofocus />
    </template>
  </Dialog>
</template>
