<script setup>
import DeferralModal from '@/components/donation/DeferralModal.vue';
import { bloodGroupOptions, rhFactorOptions } from '@/enums/BloodType';
import { deferralOptionsExamPhysical } from '@/enums/DeferralType';
import router from '@/router';
// import { normalizeEmptyStringsToNull } from '@/utils/normalizeEmptyStringsToNull';
import { useDonationStore } from '@/stores/donation/donations';
import { usePhysicalStore } from '@/stores/donation/physicalAssessment';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isLoading = ref(true);
const newPhysical = ref(true);
const idPhysical = ref(null);
const donationId = ref(null);
const showModalDeferralDonor = ref(false);
// const openModalRegister = ref(false);
const editDonation = ref(null);

const donationStore = useDonationStore();
const physicalStore = usePhysicalStore();
const physicalExam = reactive({
  weight: '',
  systolicPressure: '',
  diastolicPressure: '',
  temperature: '',
  heartRate: '',
  bloodType: null,
  rhFactor: null,
  hemoglobin: '',
  hematocrit: '',
  leukocytes: '',
  monocytes: '',
  platelets: '',
  observation: ''
});

const rules = computed(() => ({
  weight: { required: required('Peso') },
  systolicPressure: { required: required('Presión sistólica') },
  diastolicPressure: { required: required('Presión diastólica') },
  temperature: { required: required('Temperatura') },
  heartRate: { required: required('Frecuencia cardíaca') },
  bloodType: { required: required('Tipo de sangre') },
  rhFactor: { required: required('Factor Rh') },
  hemoglobin: { required: required('Hemoglobina') },
  hematocrit: { required: required('Hematocrito') }
  //   leukocytes: { required: required('Leucocitos') },
  //   monocytes: { required: required('Monocitos') },
  //   platelets: { required: required('Plaquetas') }
}));

const v$ = useVuelidate(rules, physicalExam);

const deferralDonor = async (deferral) => {
  const response = await donationStore.deferralDonor(donationId.value, deferral);
  console.log(response);
  if (response) {
    router.push({ path: 'view', query: { donationId: donationId } });
  }
};

const openDeferralDonorModal = () => {
  // if (newPhysical.value) {
  //   openModalRegister.value = true;
  //   return;
  // }
  showModalDeferralDonor.value = true;
};

function normalizeEmptyStringsToNull(obj) {
  const normalized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && value.trim() === '') {
      normalized[key] = null;
    } else {
      normalized[key] = value;
    }
  }
  return normalized;
}
const handleSave = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    console.log('Errores en el formulario', v$.value);
    return;
  }
  let physicalExamNormalized = normalizeEmptyStringsToNull(physicalExam);
  physicalExamNormalized.donationId = donationId.value;
  if (newPhysical.value) {
    await physicalStore.createPhysical(physicalExamNormalized);
    newPhysical.value = true;
  } else {
    await physicalStore.updatePhysicalAssessment(idPhysical.value, physicalExamNormalized);
  }
};
onMounted(async () => {
  isLoading.value = true;
  const donationRoute = route.query.donationId;
  donationId.value = donationRoute;
  const donationResponse = await donationStore.getDonation(donationId.value);
  editDonation.value = donationResponse.donation.status === 'En proceso';

  if (donationId.value) {
    const physicalResponse = await physicalStore.getPhysicalAssessment(donationId.value);
    if (physicalResponse) {
      idPhysical.value = physicalResponse.id;
      newPhysical.value = false;
      for (const key in physicalExam) {
        if (Object.prototype.hasOwnProperty.call(physicalResponse, key)) {
          physicalExam[key] = physicalResponse[key];
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
    <div class="flex justify-between items-center mb-4">
      <h3>Exámen físico</h3>
      <Button v-if="editDonation" class="h-8 w-full md:grow max-w-[16rem] md:max-w-[16rem]" label="Diferir donante" severity="danger" @click="openDeferralDonorModal()" />
    </div>

    <Fieldset legend="Datos físicos y clínicos">
      <!-- Contenedor principal -->
      <div class="space-y-6 mt-3">
        <!-- Peso -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div class="col-span-6 grid grid-cols-4">
            <div class="col-span-3">
              <FloatLabel variant="on">
                <InputText v-model="physicalExam.weight" id="weight" class="w-full" :invalid="v$.weight?.$error" :disabled="!editDonation" />
                <label for="weight">Peso</label>
              </FloatLabel>
              <Message v-if="v$.weight?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.weight.$errors[0].$message }}</Message>
            </div>
            <div class="col-span-1 flex items-center justify-center text-gray-600">Kg</div>
          </div>
          <div class="md:col-span-6 flex items-center text-purple-600">Debe ser mayor a 50kg</div>
        </div>

        <!-- Presión sistólica -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div class="col-span-6 grid grid-cols-4">
            <div class="col-span-3">
              <FloatLabel variant="on">
                <InputText v-model="physicalExam.systolicPressure" id="systolicPressure" class="w-full" :invalid="v$.systolicPressure?.$error" :disabled="!editDonation" />
                <label for="systolicPressure">Presión sistólica</label>
              </FloatLabel>
              <Message v-if="v$.systolicPressure?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.systolicPressure.$errors[0].$message }}</Message>
            </div>
            <div class="col-span-1 flex items-center justify-center text-gray-600">mmHg</div>
          </div>
          <div class="md:col-span-6 flex items-center text-purple-600">Debe ser entre 100-140mmHg</div>
        </div>

        <!-- Presión diastólica -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div class="col-span-6 grid grid-cols-4">
            <div class="col-span-3">
              <FloatLabel variant="on">
                <InputText v-model="physicalExam.diastolicPressure" id="diastolicPressure" class="w-full" :invalid="v$.diastolicPressure?.$error" :disabled="!editDonation" />
                <label for="diastolicPressure">Presión diastólica</label>
              </FloatLabel>
            </div>
            <div class="col-span-1 flex items-center justify-center text-gray-600">mmHg</div>
          </div>
          <div class="md:col-span-6 flex items-center text-purple-600">Debe ser entre 60-90mmHg</div>
        </div>

        <!-- Temperatura -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div class="col-span-6 grid grid-cols-4">
            <div class="col-span-3">
              <FloatLabel variant="on">
                <InputText v-model="physicalExam.temperature" id="temperature" class="w-full" :invalid="v$.temperature?.$error" :disabled="!editDonation" />
                <label for="temperature">Temperatura</label>
              </FloatLabel>
              <Message v-if="v$.temperature?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.temperature.$errors[0].$message }}</Message>
            </div>
            <div class="col-span-1 flex items-center justify-center text-gray-600">°C</div>
          </div>
          <div class="md:col-span-6 flex items-center text-purple-600">Debe ser menor a 37.5</div>
        </div>

        <!-- Frecuencia cardíaca -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div class="col-span-6 grid grid-cols-4">
            <div class="col-span-3">
              <FloatLabel variant="on">
                <InputText v-model="physicalExam.heartRate" id="heartRate" class="w-full" :invalid="v$.heartRate?.$error" :disabled="!editDonation" />
                <label for="heartRate">Frecuencia cardíaca</label>
              </FloatLabel>
              <Message v-if="v$.heartRate?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.heartRate.$errors[0].$message }}</Message>
            </div>
            <div class="col-span-1 flex items-center justify-center text-gray-600">ppm</div>
          </div>
          <div class="md:col-span-6 flex items-center text-purple-600">Debe ser entre 50-100 ppm</div>
        </div>

        <!-- Tipo de sangre -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div class="col-span-6 grid grid-cols-4">
            <div class="col-span-3">
              <FloatLabel variant="on">
                <Select v-model="physicalExam.bloodType" id="bloodType" class="w-full" :options="bloodGroupOptions" optionLabel="label" optionValue="value" :invalid="v$.bloodType?.$error" :disabled="!editDonation" />
                <label for="bloodType">Grupo Sanguineo</label>
              </FloatLabel>
              <Message v-if="v$.bloodType?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.bloodType.$errors[0].$message }}</Message>
            </div>
          </div>
        </div>

        <!-- Rh Factor -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div class="col-span-6 grid grid-cols-4">
            <div class="col-span-3">
              <FloatLabel variant="on">
                <Select v-model="physicalExam.rhFactor" id="rhFactor" class="w-full" :options="rhFactorOptions" optionLabel="label" optionValue="value" :invalid="v$.rhFactor?.$error" :disabled="!editDonation" />
                <label for="rhFactor">Rh Factor</label>
              </FloatLabel>
              <Message v-if="v$.rhFactor?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.rhFactor.$errors[0].$message }}</Message>
            </div>
          </div>
        </div>

        <!-- Hemoglobina -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div class="col-span-6 grid grid-cols-4">
            <div class="col-span-3">
              <FloatLabel variant="on">
                <InputText v-model="physicalExam.hemoglobin" id="hemoglobin" class="w-full" :invalid="v$.hemoglobin?.$error" :disabled="!editDonation" />
                <label for="hemoglobin">Hemoglobina</label>
              </FloatLabel>
              <Message v-if="v$.hemoglobin?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.hemoglobin.$errors[0].$message }}</Message>
            </div>
            <div class="col-span-1 flex items-center justify-center text-gray-600">g/dL</div>
          </div>
          <div class="md:col-span-6 flex items-center text-purple-600">Hombres: >= 13.5 g/dL, Mujeres: >=12.5 g/dL</div>
        </div>

        <!-- Hematocrito -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div class="col-span-6 grid grid-cols-4">
            <div class="col-span-3">
              <FloatLabel variant="on">
                <InputText v-model="physicalExam.hematocrit" id="hematocrit" class="w-full" :invalid="v$.hematocrit?.$error" :disabled="!editDonation" />
                <label for="hematocrit">Hematocrito</label>
              </FloatLabel>
              <Message v-if="v$.hematocrit?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.hematocrit.$errors[0].$message }}</Message>
            </div>
            <div class="col-span-1 flex items-center justify-center text-gray-600">%</div>
          </div>
          <div class="md:col-span-6 flex items-center text-purple-600">Hombres: >= 40%, Mujeres: >=38%</div>
        </div>

        <!-- Plaquetas -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div class="col-span-6 grid grid-cols-4">
            <div class="col-span-3">
              <FloatLabel variant="on">
                <InputText v-model="physicalExam.platelets" id="platelets" class="w-full" :disabled="!editDonation" />
                <label for="platelets">Plaquetas</label>
              </FloatLabel>
            </div>
            <div class="col-span-1 flex items-center justify-center text-gray-600">10⁹/L</div>
          </div>
          <div class="md:col-span-6 flex items-center text-purple-600">Debe ser mayor a 150</div>
        </div>

        <!-- Leucocitos -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div class="col-span-6 grid grid-cols-4">
            <div class="col-span-3">
              <FloatLabel variant="on">
                <InputText v-model="physicalExam.leukocytes" id="leukocytes" class="w-full" :disabled="!editDonation" />
                <label for="leukocytes">Leucocitos</label>
              </FloatLabel>
            </div>
            <div class="col-span-1 flex items-center justify-center text-gray-600">10⁹/L</div>
          </div>
          <div class="md:col-span-6 flex items-center text-purple-600">Debe estar entre 4 y 10 x 10⁹/L</div>
        </div>

        <!-- Monocitos -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div class="col-span-6 grid grid-cols-4">
            <div class="col-span-3">
              <FloatLabel variant="on">
                <InputText v-model="physicalExam.monocytes" id="monocytes" class="w-full" :disabled="!editDonation" />
                <label for="monocytes">Monocitos</label>
              </FloatLabel>
            </div>
            <div class="col-span-1 flex items-center justify-center text-gray-600">%</div>
          </div>
          <div class="md:col-span-6 flex items-center text-purple-600">Debe estar entre 2 y 10%</div>
        </div>

        <!-- Observaciones -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div class="md:col-span-12">
            <FloatLabel variant="on">
              <Textarea v-model="physicalExam.observation" id="observation" rows="5" class="w-full resize-none" :disabled="!editDonation" />
              <label for="observation">Observaciones</label>
            </FloatLabel>
          </div>
        </div>
      </div>
    </Fieldset>

    <div class="flex justify-end px-8 my-8 gap-4">
      <Button class="h-10 w-full md:max-w-[16rem] btn-clean" label="Cancelar" @click="router.back()" />
      <Button v-if="editDonation" class="h-10 w-full md:max-w-[16rem]" label="Guardar" severity="success" @click="handleSave" />
    </div>
    <DeferralModal v-model="showModalDeferralDonor" :options-reason="deferralOptionsExamPhysical" @save="deferralDonor" />
    <!-- <Dialog v-model:visible="openModalRegister" header=" " :modal="true" class="w-[30rem]">
      <p><strong> Debe registrar primero el examen físico para poder diferir al donante</strong></p>
      <template #footer>
        <Button label="Aceptar" class="min-w-40 p-button-success" @click="() => (openModalRegister = false)" />
      </template>
    </Dialog> -->
  </div>
</template>
