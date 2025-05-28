<script setup>
// import DonationStatusCard from '@/components/donation/DonationStatusCard.vue';
import UnitCardStatus from '@/components/unit/UnitCardStatus.vue';
import UnitInfoCard from '@/components/unit/UnitInfoCard.vue';
import UnitSerologyTest from '@/components/unit/UnitSerologyTest.vue';
import { useDonationStore } from '@/stores/donation/donations';
import { useSerologyTestStore } from '@/stores/laboratory/serologyTest';
import { useUnitStore } from '@/stores/storage/units';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const donationStore = useDonationStore();
const serologyStore = useSerologyTestStore();
const unitSore = useUnitStore();
const route = useRoute();
const router = useRouter();

const donation = ref(null);
const serologyTest = ref(null);
const bloodType = ref(null);
const unit = ref(null);

const donationId = computed(() => route.query.donationId);
const unitId = computed(() => route.query.unitId);
const showReactiveWarning = ref(false);
const fieldPendingReset = ref(null);

const isLoading = ref(true);
const serologyResult = ref({
  testDate: null,
  hiv: null,
  hbsAg: null,
  HBcAb: null,
  HCV: null,
  syphilis: null,
  chagas: null,
  htlvI_II: null,
  observations: ''
});

const rules = computed(() => ({
  testDate: { required: required('Fecha de prueba') },
  hiv: { required: required('VIH') },
  hbsAg: { required: required('HBsAg') },
  hbcAb: { required: required('HBcAb') },
  hcv: { required: required('VHC') },
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
  const serologyTestResponse = await serologyStore.getSerologyTestByDonationId(donationId.value);
  const unitReponse = await unitSore.getUnitById(unitId.value);
  unit.value = unitReponse;
  donation.value = donationResponse;
  serologyTest.value = serologyTestResponse;
  bloodType.value = unit.value.bloodType;
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
      <h2>Visualizar unidad en Stock</h2>
      <div>
        <UnitCardStatus :codeUnit="unitId" :status="unit.status" />
      </div>

      <UnitInfoCard :unit="unit" />

      <UnitSerologyTest :serologyTest="serologyTest" :bloodType="bloodType" :showBloodType="false" />

      <div v-if="serologyTest" class="flex justify-center px-8 my-8 gap-4">
        <Button class="h-10 w-full md:max-w-[16rem]" label="Descartar Unidad" severity="danger" />
        <Button class="h-10 w-full md:max-w-[16rem]" label="Obtener Etiqueta" severity="success" />
      </div>
    </div>
  </div>
</template>
