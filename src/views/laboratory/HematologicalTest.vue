<script setup>
// import DonationStatusCard from '@/components/donation/DonationStatusCard.vue';
import InfoDonation from '@/components/donation/InfoDonation.vue';
import InfoDonor from '@/components/donation/InfoDonor.vue';
import { bloodGroupOptions, rhFactorOptions } from '@/enums/BloodType';
import { useDonationStore } from '@/stores/donation/donations';
import { useHematologicalTestStore } from '@/stores/laboratory/hematologicalTest';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const donationStore = useDonationStore();
const hematologicalStore = useHematologicalTestStore();
const route = useRoute();
const router = useRouter();
const donation = ref(null);
const donationId = computed(() => route.query.donationId);

const isLoading = ref(true);
const hematologicalResult = ref({
  testDate: null,
  bloodType: null,
  rhFactor: null,
  phenotype: '',
  genotype: '',
  irregularAntibodies: '',
  hemoglobin: null,
  hematocrit: null,
  platelets: null,
  leukocytes: null,
  monocytes: null,
  observations: ''
});

const rules = computed(() => ({
  testDate: { required: required('Fecha de prueba') },
  bloodType: { required: required('Grupo sanguíneo') },
  rhFactor: { required: required('Factor Rh') },
  phenotype: { required: required('Fenotipo') },
  genotype: { required: required('Genotipo') },
  irregularAntibodies: { required: required('Anticuerpos irregulares') },
  hemoglobin: { required: required('Hemoglobina') },
  hematocrit: { required: required('Hematocrito') },
  platelets: { required: required('Plaquetas') },
  leukocytes: { required: required('Leucocitos') },
  monocytes: { required: required('Monocitos') }
}));

const v$ = useVuelidate(rules, hematologicalResult);

const handleSave = async () => {
  const isValid = await v$.value.$validate();
  if (isValid) {
    let hematologicalResultNormalized = normalizeEmptyStringsToNull(hematologicalResult.value);
    const donationRoute = route.query.donationId;
    hematologicalResultNormalized.donationId = donationRoute;
    await hematologicalStore.createhematologicalTest(hematologicalResultNormalized);
  } else {
    console.log('Errores en el formulario', v$.value);
  }
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

onMounted(async () => {
  const donationResponse = await donationStore.getDonation(donationId.value);
  donation.value = donationResponse;
  isLoading.value = false;
});
</script>

<template>
  <div v-if="isLoading" class="card absolute inset-0 bg-white/50 flex items-center justify-center z-10">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else class="card">
    <div v-if="!donation.canViewDonation">
      <div class="card felx justify-center items-center">
        <p class="text-red-500">Usted no tiene permisos para visualizar esta donación</p>
      </div>
    </div>
    <div v-else>
      <!-- Información de la donación -->
      <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-1 mb-4">
        <div class="md:col-span-3">
          <DonationStatusCard :code-donation="donation.donation.id" :status="donation.donation.status" :deferral-end-date="donation.donor.deferralEndDate" :deferral-reason="donation.donor.deferralReason" />
        </div>
        <div class="md:col-span-1 flex justify-end items-center">
          <Button label="Diferir donante" class="h-8 w-full md:grow md:max-w-[16rem]" severity="danger" />
        </div>
      </div> -->
      <!-- Información de donante -->

      <Fieldset legend="Datos generales del donante" class="!mb-4">
        <div class="rounded-md px-5 pt-5 pb-2 bg-white">
          <InfoDonor :donor="donation?.donor" :isEditable="false" />
        </div>
      </Fieldset>

      <Fieldset legend="Datos generales de la donación" class="!mb-4">
        <div class="rounded-md px-5 pt-5 pb-2 bg-white">
          <InfoDonation :donation="donation?.donation" :isEditable="false" />
        </div>
      </Fieldset>

      <Fieldset legend="Datos de los resultados" class="mb-4">
        <div class="space-y-4">
          <!-- Fecha prueba -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <div class="md:col-span-3 font-medium">Fecha de prueba:</div>
            <div class="md:col-span-9">
              <DatePicker v-model="hematologicalResult.testDate" dateFormat="dd/mm/yy" showIcon fluid class="w-full md:w-72" :invalid="v$.testDate?.$error" />
              <Message v-if="v$.testDate?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.testDate.$errors[0].$message }}</Message>
            </div>
          </div>

          <!-- Tipo de sangre -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
            <div class="col-span-6 grid grid-cols-4">
              <div class="col-span-3">
                <FloatLabel variant="on">
                  <Select v-model="hematologicalResult.bloodType" id="bloodType" class="w-full" :options="bloodGroupOptions" optionLabel="label" optionValue="value" :invalid="v$.bloodType?.$error" />
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
                  <Select v-model="hematologicalResult.rhFactor" id="rhFactor" class="w-full" :options="rhFactorOptions" optionLabel="label" optionValue="value" :invalid="v$.rhFactor?.$error" />
                  <label for="rhFactor">Rh Factor</label>
                </FloatLabel>
                <Message v-if="v$.rhFactor?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.rhFactor.$errors[0].$message }}</Message>
              </div>
            </div>
          </div>

          <!-- Fenotipo -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
            <div class="col-span-6 grid grid-cols-4">
              <div class="col-span-3">
                <FloatLabel variant="on">
                  <InputText v-model="hematologicalResult.phenotype" id="phenotype" class="w-full" :invalid="v$.phenotype?.$error" />
                  <label for="phenotype">Fenotipo</label>
                </FloatLabel>
                <Message v-if="v$.phenotype?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.phenotype.$errors[0].$message }}</Message>
              </div>
              <div class="col-span-1 flex items-center justify-center text-gray-600"></div>
            </div>
            <div class="md:col-span-6 flex items-center text-purple-600"></div>
          </div>

          <!-- Genotipo -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
            <div class="col-span-6 grid grid-cols-4">
              <div class="col-span-3">
                <FloatLabel variant="on">
                  <InputText v-model="hematologicalResult.genotype" id="genotype" class="w-full" :invalid="v$.genotype?.$error" />
                  <label for="genotype">Genotipo</label>
                </FloatLabel>
                <Message v-if="v$.genotype?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.genotype.$errors[0].$message }}</Message>
              </div>
              <div class="col-span-1 flex items-center justify-center text-gray-600"></div>
            </div>
            <div class="md:col-span-6 flex items-center text-purple-600"></div>
          </div>

          <!-- Anticuerpos Irregulares -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
            <div class="col-span-6 grid grid-cols-4">
              <div class="col-span-3">
                <FloatLabel variant="on">
                  <InputText v-model="hematologicalResult.irregularAntibodies" id="irregularAntibodies" class="w-full" :invalid="v$.irregularAntibodies?.$error" />
                  <label for="irregularAntibodies">Anticuerpos Irregulares</label>
                </FloatLabel>
                <Message v-if="v$.irregularAntibodies?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.irregularAntibodies.$errors[0].$message }}</Message>
              </div>
              <div class="col-span-1 flex items-center justify-center text-gray-600"></div>
            </div>
            <div class="md:col-span-6 flex items-center text-purple-600"></div>
          </div>

          <!-- Hemoglobina -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
            <div class="col-span-6 grid grid-cols-4">
              <div class="col-span-3">
                <FloatLabel variant="on">
                  <InputText v-model="hematologicalResult.hemoglobin" id="hemoglobin" class="w-full" :invalid="v$.hemoglobin?.$error" />
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
                  <InputText v-model="hematologicalResult.hematocrit" id="hematocrit" class="w-full" :invalid="v$.hematocrit?.$error" />
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
                  <InputText v-model="hematologicalResult.platelets" id="platelets" class="w-full" :invalid="v$.platelets?.$error" />
                  <label for="platelets">Plaquetas</label>
                </FloatLabel>
                <Message v-if="v$.platelets?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.platelets.$errors[0].$message }}</Message>
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
                  <InputText v-model="hematologicalResult.leukocytes" id="leukocytes" class="w-full" :invalid="v$.leukocytes?.$error" />
                  <label for="leukocytes">Leucocitos</label>
                </FloatLabel>
                <Message v-if="v$.leukocytes?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.leukocytes.$errors[0].$message }}</Message>
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
                  <InputText v-model="hematologicalResult.monocytes" id="monocytes" class="w-full" :invalid="v$.monocytes?.$error" />
                  <label for="monocytes">Monocitos</label>
                </FloatLabel>
                <Message v-if="v$.monocytes?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.monocytes.$errors[0].$message }}</Message>
              </div>
              <div class="col-span-1 flex items-center justify-center text-gray-600">%</div>
            </div>
            <div class="md:col-span-6 flex items-center text-purple-600">Debe estar entre 2 y 10%</div>
          </div>

          <!-- Observaciones -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
            <div class="md:col-span-9">
              <FloatLabel variant="on">
                <Textarea id="observations" v-model="hematologicalResult.observations" rows="5" class="w-full resize-none" />
                <label for="observations">Observaciones</label>
              </FloatLabel>
            </div>
          </div>
        </div>
      </Fieldset>
      <div class="flex justify-end px-8 my-8 gap-4">
        <Button class="h-10 w-full md:max-w-[16rem] btn-clean" label="Cancelar" @click="router.back()" />
        <Button class="h-10 w-full md:max-w-[16rem]" label="Guardar" severity="success" @click="handleSave" />
      </div>
    </div>
  </div>
</template>
