<script setup>
// import DonationStatusCard from '@/components/donation/DonationStatusCard.vue';
import InfoDonation from '@/components/donation/InfoDonation.vue';
import InfoDonor from '@/components/donation/InfoDonor.vue';
import UnitCardStatus from '@/components/unit/UnitCardStatus.vue';
import { RhFactor } from '@/enums/BloodType';
import { resultSerology } from '@/enums/SerologyResult';
import { useDonationStore } from '@/stores/donation/donations';
import { useHematologicalTestStore } from '@/stores/laboratory/hematologicalTest';
import { useSerologyTestStore } from '@/stores/laboratory/serologyTest';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const donationStore = useDonationStore();
const serologyStore = useSerologyTestStore();
const hematologicStore = useHematologicalTestStore();
const route = useRoute();
const router = useRouter();

const donation = ref(null);
const hematologicTest = ref(null);
const serologyTest = ref(null);
const donationId = computed(() => route.query.donationId);
const unitId = computed(() => route.query.unitId);
const showReactiveWarning = ref(false);
const fieldPendingReset = ref(null);

const isLoading = ref(true);
const serologyResult = ref({
  testDate: null,
  HIV: null,
  HBsAg: null,
  HBcAb: null,
  HCV: null,
  syphilis: null,
  chagas: null,
  htlvI_II: null,
  observations: ''
});

const rules = computed(() => ({
  testDate: { required: required('Fecha de prueba') },
  HIV: { required: required('VIH') },
  HBsAg: { required: required('HBsAg') },
  HBcAb: { required: required('HBcAb') },
  HCV: { required: required('VHC') },
  syphilis: { required: required('Sífilis') },
  chagas: { required: required('Chagas') },
  htlvI_II: { required: required('HtlvI_II') }
}));

const v$ = useVuelidate(rules, serologyResult);

const handleSave = async () => {
  const isValid = await v$.value.$validate();
  if (isValid) {
    let serologyResultNormalized = normalizeEmptyStringsToNull(serologyResult.value);
    const donationRoute = route.query.donationId;
    serologyResultNormalized.donationId = donationRoute;
    await serologyStore.createSerologyTest(serologyResultNormalized);
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

Object.keys(serologyResult.value).forEach((key) => {
  watch(
    () => serologyResult.value[key],
    (newValue) => {
      if (newValue === true) {
        fieldPendingReset.value = key;
        showReactiveWarning.value = true;
      }
    }
  );
});

onMounted(async () => {
  const donationResponse = await donationStore.getDonation(donationId.value);
  const hematologicalTestResponse = await hematologicStore.getHematologicalTestByDonationId(donationId.value);
  const serologyTestResponse = await serologyStore.getSerologyTestByDonationId(donationId.value);
  donation.value = donationResponse;
  hematologicTest.value = hematologicalTestResponse;
  serologyTest.value = serologyTestResponse;
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
      <h2>Unidad en cuarentena</h2>
      <div v-if="serologyTest && serologyTest.status == 'REACTIVO'">
        <UnitCardStatus :codeUnit="unitId" :status="serologyTest.status" />
      </div>

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
        <div v-if="serologyTest === null" class="py-4 text-center">
          <i class="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
          <p class="text-gray-700 font-medium">Resultados pendientes de pruebas</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <!-- Columna izquierda -->
          <div class="space-y-2">
            <div class="flex">
              <div class="mr-2">Fecha serología:</div>
              <div>{{ serologyTest.testDate }}</div>
            </div>

            <div class="flex">
              <div class="font-medium w-28">VIH:</div>
              <div class="text-center mb-2 font-bold" :class="serologyTest.hiv ? 'text-red-600' : 'text-black'">
                {{ serologyTest.hiv ? resultSerology.TRUE : resultSerology.FALSE }}
              </div>
            </div>

            <div class="flex">
              <div class="font-medium w-28">HBsAg:</div>
              <div class="text-center mb-2" :class="serologyTest.hbsAg ? 'text-red-600 font-bold' : 'text-black'">
                {{ serologyTest.hbsAg ? resultSerology.TRUE : resultSerology.FALSE }}
              </div>
            </div>

            <div class="flex">
              <div class="font-medium w-28">HBcAb:</div>
              <div class="text-center mb-2" :class="serologyTest.hbcAb ? 'text-red-600 font-bold' : 'text-black'">
                {{ serologyTest.hbcAb ? resultSerology.TRUE : resultSerology.FALSE }}
              </div>
            </div>

            <div class="flex">
              <div class="font-medium w-28">VHC:</div>
              <div class="text-center mb-2" :class="serologyTest.hcv ? 'text-red-600 font-bold' : 'text-black'">
                {{ serologyTest.hcv ? resultSerology.TRUE : resultSerology.FALSE }}
              </div>
            </div>

            <div class="flex">
              <div class="font-medium w-28">Sífilis:</div>
              <div class="text-center mb-2" :class="serologyTest.syphilis ? 'text-red-600 font-bold' : 'text-black'">
                {{ serologyTest.syphilis ? resultSerology.TRUE : resultSerology.FALSE }}
              </div>
            </div>

            <div class="flex">
              <div class="font-medium w-28">Chagas:</div>
              <div class="text-center mb-2" :class="serologyTest.chagas ? 'text-red-600 font-bold' : 'text-black'">
                {{ serologyTest.chagas ? resultSerology.TRUE : resultSerology.FALSE }}
              </div>
            </div>

            <div class="flex">
              <div class="font-medium w-28">HTLV-I/II:</div>
              <div class="text-center mb-2" :class="serologyTest.htlvI_II ? 'text-red-600 font-bold' : 'text-black'">
                {{ serologyTest.htlvI_II ? resultSerology.TRUE : resultSerology.FALSE }}
              </div>
            </div>

            <div class="flex">
              <div class="font-medium w-28">Observaciones:</div>
              <div>{{ serologyTest.observations || '-' }}</div>
            </div>
          </div>

          <!-- Columna derecha -->
          <div class="flex flex-col">
            <div class="text-xl mb-2 font-medium">Grupo sanguíneo</div>
            <div class="text-4xl font-bold">{{ hematologicTest.bloodType }}{{ RhFactor[hematologicTest.rhFactor]?.symbol || '' }}</div>
          </div>
        </div>
      </Fieldset>
      <div v-if="serologyTest" class="flex justify-center px-8 my-8 gap-4">
        <Button v-if="serologyTest.status != 'REACTIVO'" class="h-10 w-full md:max-w-[16rem]" label="Unidad Apta" severity="success" />
        <Button class="h-10 w-full md:max-w-[16rem]" label="Descartar Unidad" severity="danger" />
      </div>
    </div>
  </div>
</template>
