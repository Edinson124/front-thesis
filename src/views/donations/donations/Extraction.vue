<script setup>
import DeferralModal from '@/components/donation/DeferralModal.vue';
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { adverseReactionDonationOptions } from '@/enums/AdverseReaction';
import { DeferralReasonsExtraction } from '@/enums/DeferralType';
import { extractionStatusOptions } from '@/enums/Status';
import router from '@/router';
import { useDonationStore } from '@/stores/donation/donations';
import { useExtractionStore } from '@/stores/donation/extraction';
import { required, requiredIf } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const extractionStore = useExtractionStore();
const donationStore = useDonationStore();
const route = useRoute();

const isLoading = ref(true);
const newExtraction = ref(true);
const idExtraction = ref(null);
const donationId = ref(null);
const editDonation = ref(null);
const showModalDeferralDonor = ref(false);

const showConfirmModal = ref(false);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);

const showCancelConfirmDialog = ref(false);

const extraction = reactive({
  startDate: null,
  startTime: null,
  endDateTime: null,
  durationMinutes: '',
  processedBloodVolumeMl: '',
  arm: null,
  adverseReactionOccurred: null,
  adverseReaction: null,
  otherReaction: '',
  status: null,
  observation: ''
});

// Reglas de validación
const rules = computed(() => ({
  extraction: {
    startDate: { required: required('Fecha de Inicio') },
    startTime: { required: required('Hora de Inicio') },
    durationMinutes: { required: required('Duración') },
    processedBloodVolumeMl: { required: required('Volumen total extraído') },
    arm: { required: required('Brazo de extracción') },
    adverseReactionOccurred: { required: required('¿Se presentó reacciones adversas?') },
    adverseReaction: {
      required: requiredIf('Reacciones adversas', () => extraction.adverseReactionOccurred === true)
    },
    status: { required: required('Estado de extracción') }
  }
}));

const v$ = useVuelidate(rules, { extraction });

const calculateEndTime = computed(() => {
  if (extraction.startDate && extraction.startTime && extraction.durationMinutes > 0) {
    const startDateTime = new Date(extraction.startDate);
    const startTime = new Date(extraction.startTime);
    // Establece las horas y minutos de startDateTime usando startTime
    startDateTime.setHours(startTime.getHours());
    startDateTime.setMinutes(startTime.getMinutes());
    // Suma la duración en minutos
    startDateTime.setMinutes(startDateTime.getMinutes() + parseInt(extraction.durationMinutes));
    return startDateTime;
  }
  return null;
});

watch([() => extraction.startDate, () => extraction.startTime, () => extraction.durationMinutes], () => {
  extraction.endDateTime = calculateEndTime.value;
});
watch(
  () => extraction.adverseReactionOccurred,
  (newVal) => {
    if (newVal === false) {
      extraction.adverseReaction = null;
    }
  }
);
const openDeferralDonorModal = () => {
  // if (newPhysical.value) {
  //   openModalRegister.value = true;
  //   return;
  // }
  showModalDeferralDonor.value = true;
};
const deferralDonor = async (deferral) => {
  const response = await donationStore.deferralDonor(donationId.value, deferral);
  if (response) {
    router.push({ path: 'view', query: { donationId: donationId.value } });
  }
};

const cancel = () => {
  showCancelConfirmDialog.value = true;
};

const returnDonationView = () => {
  router.push({ path: 'view', query: { donationId: donationId.value } });
};

const saveExtraction = async () => {
  const extractionData = JSON.parse(JSON.stringify(extraction));
  const donationRoute = route.query.donationId;
  extractionData.donationId = donationRoute;
  const result = newExtraction.value ? await extractionStore.createExtraction(extractionData) : await extractionStore.updateExtraction(idExtraction.value, extractionData);
  showSuccessModal.value = result !== null;
  showErrorModal.value = result === null;
};

const handleSave = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;
  showConfirmModal.value = true;
};
onMounted(async () => {
  isLoading.value = true;
  const donationRoute = route.query.donationId;
  donationId.value = donationRoute;
  const donationResponse = await donationStore.getDonation(donationId.value);
  editDonation.value = donationResponse.donation.status === 'En proceso';

  if (donationId.value) {
    const extractionResponse = await extractionStore.getExtraction(donationId.value);
    if (extractionResponse) {
      idExtraction.value = extractionResponse.id;
      newExtraction.value = false;
      for (const key in extraction) {
        if (Object.prototype.hasOwnProperty.call(extractionResponse, key)) {
          extraction[key] = extractionResponse[key];
        }
      }
    }
  }
  isLoading.value = false;
});
</script>

<template>
  <div v-if="isLoading" class="card absolute inset-0 bg-white/50 flex items-center justify-center z-10">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else class="card">
    <div class="mb-4 flex flex-wrap justify-between items-center gap-2">
      <h3 class="min-w-[10rem] !mt-2">Extracción de la donación</h3>
      <Button class="h-8 w-full md:grow md:max-w-[16rem]" label="Diferir donante" severity="danger" @click="openDeferralDonorModal()" />
    </div>

    <Fieldset legend="Datos de la extracción">
      <div class="flex items-center justify-between gap-4 px-8 mt-6 mb-2">
        <span class="w-full md:w-1/4">
          <FloatLabel variant="on" class="w-full">
            <DatePicker v-model="extraction.startDate" class="w-full" showIcon fluid showButtonBar :disabled="!editDonation" />
            <label for="startDate">Fecha de Inicio</label>
          </FloatLabel>
          <Message v-if="v$.extraction.startDate?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.extraction.startDate.$errors[0].$message }}</Message>
        </span>

        <span class="w-full md:w-1/4">
          <FloatLabel variant="on" class="w-full">
            <DatePicker v-model="extraction.startTime" class="w-full" showIcon fluid iconDisplay="input" timeOnly :disabled="!editDonation">
              <template #inputicon="slotProps">
                <i class="pi pi-clock" @click="slotProps.clickCallback" />
              </template>
            </DatePicker>
            <label for="startTime">Hora de Inicio</label>
          </FloatLabel>
          <Message v-if="v$.extraction.startTime?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.startTime.$errors[0].$message }}
          </Message>
        </span>

        <FloatLabel variant="on" class="w-full md:w-1/4">
          <DatePicker id="endDateTime" v-model="extraction.endDateTime" disabled class="w-full" showIcon fluid showTime hourFormat="24" />
          <label for="endDateTime">Fecha y Hora Final</label>
        </FloatLabel>
      </div>

      <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <span class="w-full">
          <div class="w-full flex items-center gap-4">
            <FloatLabel variant="on" class="w-full md:w-1/4">
              <InputText v-model="extraction.durationMinutes" class="w-full" id="durationMinutes" :disabled="!editDonation" />
              <label for="durationMinutes">Duración</label>
            </FloatLabel>
            <span>min</span>
          </div>
          <Message v-if="v$.extraction.durationMinutes?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.durationMinutes.$errors[0].$message }}
          </Message>
        </span>
      </div>

      <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <span class="w-full">
          <div class="w-full flex items-center gap-4">
            <FloatLabel variant="on" class="w-full md:w-1/4">
              <InputText v-model="extraction.processedBloodVolumeMl" class="w-full" id="processedBloodVolumeMl" :disabled="!editDonation" />
              <label for="processedBloodVolumeMl">Volumen total extraído</label>
            </FloatLabel>
            <span>ml</span>
          </div>
          <Message v-if="v$.extraction.processedBloodVolumeMl?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.processedBloodVolumeMl.$errors[0].$message }}
          </Message>
        </span>
      </div>

      <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <span class="w-full md:w-1/4">
          <FloatLabel variant="on" class="w-full">
            <Select
              v-model="extraction.arm"
              class="w-full"
              :options="[
                { label: 'Izquierdo', value: 'Izquierdo' },
                { label: 'Derecho', value: 'Derecho' }
              ]"
              optionLabel="label"
              optionValue="value"
              showClear
              :disabled="!editDonation"
            />
            <label>Brazo de extracción</label>
          </FloatLabel>
          <Message v-if="v$.extraction.arm?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.arm.$errors[0].$message }}
          </Message>
        </span>
      </div>

      <div class="flex flex-col gap-2 px-8 mt-6 mb-2">
        <div class="flex items-center gap-8">
          <h6 class="m-0">¿Se presentó reacciones adversas?</h6>
          <div
            class="flex items-center gap-2"
            v-for="(option, index) in [
              { label: 'Si', value: true },
              { label: 'No', value: false }
            ]"
            :key="index"
          >
            <RadioButton :inputId="`reaction-${index}`" :value="option.value" v-model="extraction.adverseReactionOccurred" name="adverseReactionOccurred" :disabled="!editDonation" />
            <label :for="`reaction-${index}`">{{ option.label }}</label>
          </div>
        </div>
        <Message v-if="v$.extraction.adverseReactionOccurred?.$error" severity="error" size="small" variant="simple" class="mt-2">
          {{ v$.extraction.adverseReactionOccurred.$errors[0].$message }}
        </Message>
      </div>

      <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <span class="w-full md:w-1/4">
          <FloatLabel variant="on" class="w-full">
            <Select v-model="extraction.adverseReaction" class="w-full" :options="adverseReactionDonationOptions" optionLabel="label" optionValue="value" showClear :disabled="!editDonation || !extraction.adverseReactionOccurred" />
            <label>Reacciones adversas</label>
          </FloatLabel>
          <Message v-if="v$.extraction.adverseReaction?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.adverseReaction.$errors[0].$message }}
          </Message>
        </span>
      </div>

      <!-- <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <FloatLabel variant="on" class="w-full md:w-1/4">
          <InputText v-model="extraction.otherReaction" class="w-full" id="other-reaction" :disabled="!editDonation" />
          <label for="other-reaction">Otra reacción</label>
        </FloatLabel>
      </div> -->

      <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <span class="w-full md:w-1/4">
          <FloatLabel variant="on" class="w-full">
            <Select v-model="extraction.status" class="w-full" :options="extractionStatusOptions" optionLabel="label" optionValue="value" showClear :disabled="!editDonation" />
            <label>Estado de extracción</label>
          </FloatLabel>
          <Message v-if="v$.extraction.status?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.status.$errors[0].$message }}
          </Message>
        </span>
      </div>

      <div class="flex flex-col items-start gap-4 px-8 mt-10 mb-6">
        <FloatLabel variant="on" class="w-full">
          <Textarea id="observation" v-model="extraction.observation" class="w-full md:grow resize-none" rows="5" :disabled="!editDonation" />
          <label for="observation">Observaciones</label>
        </FloatLabel>
      </div>
    </Fieldset>

    <div class="flex justify-end px-8 my-8 gap-4">
      <Button class="h-10 w-full md:max-w-[16rem] btn-clean" label="Cancelar" @click="cancel" />
      <Button v-if="editDonation" class="h-10 w-full md:max-w-[16rem]" label="Guardar" severity="success" @click="handleSave" />
    </div>
    <DeferralModal v-model="showModalDeferralDonor" :options-reason="DeferralReasonsExtraction" @save="deferralDonor" />

    <ConfirmModal id="confirmSaveExtraction" v-model="showConfirmModal" header="¿Estás seguro de guardar los datos de la extracción?" accept-text="Guardar" @accept="saveExtraction" />
    <SuccessModal id="successSaveExtraction" v-model="showSuccessModal" message="Los datos de la extracción fueron guardados con éxito" @close="returnDonationView" />
    <ErrorModal id="errorSaveExtraction" v-model="showErrorModal" />

    <ConfirmModal id="cancelSaveExtraction" v-model="showCancelConfirmDialog" header="¿Estás seguro de que deseas cancelar la operación?" accept-text="Sí" accept-button-class="p-button-danger" @accept="returnDonationView" reject-text="No" />
  </div>
</template>
