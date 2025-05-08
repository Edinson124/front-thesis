<script setup>
import { documentTypesPatientOptions } from '@/enums/DocumentTypes';
import { componentDonationOptions } from '@/enums/Donation';
import { DonorType, donorTypesOptions } from '@/enums/Donor';
import { DonorStatus } from '@/enums/Status';
import { useDonationStore } from '@/stores/donation/donations';
import { usePatientStore } from '@/stores/transfusion/patient';
import { required, requiredIf } from '@/validation/validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const donationStore = useDonationStore();
const patientStore = usePatientStore();
const route = useRoute();
const showModalDocument = ref(false);
const pacienteEncontrado = ref(false);
const tipoDocumentoPacienteBuscado = ref('');
const numeroDocumentoPacienteBuscado = ref('');
const showSuccessModal = ref(false);
const createdDonationId = ref(null);

const actuadlDonationId = ref(null);
const lastDonationDateDetail = ref(null);
const canDonateDateLastDonation = ref(true);

const nombrePaciente = ref('');
const pacienteBuscado = ref(false);

const props = defineProps({
  donor: {
    type: Object,
    required: true
  }
});

const donation = reactive({
  documentTypeDonor: null,
  documentNumberDonor: null,
  documentTypePatient: null,
  documentNumberPatient: null,
  bloodBankId: 1,
  donationPurpose: null,
  bloodComponent: null,
  observation: null
});

const isEnableDonationToStatus = computed(() => {
  return DonorStatus[props.donor.status]?.enableToNewDonation === true;
});

const rules = computed(() => ({
  documentTypeDonor: { required: required('Tipo de documento') },
  documentNumberDonor: { required: required('Número de documento') },
  donationPurpose: { required: required('Tipo de donante') },
  bloodComponent: { required: required('Componente Donado') },
  documentNumberPatient: {
    required: requiredIf('Número de documento', () => requiresPaciente.value)
  },
  documentTypePatient: {
    required: requiredIf('Tipo de documento', () => requiresPaciente.value)
  }
}));

const v$ = useVuelidate(rules, donation);

const validatePatient = async () => {
  pacienteBuscado.value = false;
  const documentType = donation.documentTypePatient;
  const documentNumber = donation.documentNumberPatient;
  if (documentType == null || documentType == '') return;
  if (documentNumber == null || documentNumber == '') return;

  const fullName = await patientStore.validatePatient(documentNumber, documentType);

  pacienteBuscado.value = true;
  tipoDocumentoPacienteBuscado.value = documentType;
  numeroDocumentoPacienteBuscado.value = documentNumber;

  if (fullName) {
    pacienteEncontrado.value = true;
    nombrePaciente.value = fullName;
  } else {
    pacienteEncontrado.value = false;
    nombrePaciente.value = '';
  }
};

const requiresPaciente = computed(() => {
  return DonorType[donation.donationPurpose]?.requiredPacient === true;
});

const isSameDonor = computed(() => {
  return DonorType[donation.donationPurpose]?.sameDonor === true;
});
watch(
  () => donation.donationPurpose,
  () => {
    pacienteBuscado.value = false;
    pacienteEncontrado.value = false;
    nombrePaciente.value = '';
    tipoDocumentoPacienteBuscado.value = '';
    numeroDocumentoPacienteBuscado.value = '';
  }
);
watch(isSameDonor, (newVal) => {
  if (newVal) {
    donation.documentTypePatient = props.donor.documentType;
    donation.documentNumberPatient = props.donor.documentNumber;
  } else {
    donation.documentTypePatient = null;
    donation.documentNumberPatient = '';
  }
});
const closeModal = () => {
  showModalDocument.value = false;
};

const saveDonation = async () => {
  console.log('saveD');
  const isValid = await v$.value.$validate();
  if (!isValid) return;
  if (requiresPaciente.value && !pacienteEncontrado.value) {
    showModalDocument.value = true;
    return;
  }
  if (!requiresPaciente.value) {
    donation.documentNumberPatient = null;
    donation.documentTypePatient = null;
  }
  console.log('saveeeD');
  const id = await donationStore.newDonation(donation);
  if (id) {
    createdDonationId.value = id;
    showSuccessModal.value = true;
  }
};

const emit = defineEmits(['cancel', 'success']);

const confirmSuccess = () => {
  showSuccessModal.value = false;
  emit('success');
};

const cancelSave = () => {
  emit('cancel');
};

onMounted(async () => {
  const documentNumber = route.params.doc;
  const documentType = route.params.type;

  // const donorResponse = await donorStore.getDonor(documentNumber, documentType);
  // Object.assign(donor, { ...donor, ...donorResponse });

  donation.documentTypeDonor = props.donor.documentType;
  donation.documentNumberDonor = props.donor.documentNumber;

  const actualDonationResponse = await donationStore.getActualDonation(documentNumber, documentType);
  //Id actual donación en proceso
  actuadlDonationId.value = actualDonationResponse ? actualDonationResponse.id : null;

  const lastDonationDateDetailResponse = await donationStore.getLastDateDonation(documentNumber, documentType);
  //Detalle de fecha de ultima donación
  lastDonationDateDetail.value = lastDonationDateDetailResponse;
  //Si puedes donar despues del tiempo de la última donación
  canDonateDateLastDonation.value = lastDonationDateDetailResponse ? lastDonationDateDetailResponse.isEnableDonation : true;
});
</script>

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
