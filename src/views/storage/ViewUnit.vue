<script setup>
// import DonationStatusCard from '@/components/donation/DonationStatusCard.vue';
import UnitCardStatus from '@/components/unit/UnitCardStatus.vue';
import UnitDiscardModal from '@/components/unit/UnitDiscardModal.vue';
import UnitInfoCard from '@/components/unit/UnitInfoCard.vue';
import UnitSerologyTest from '@/components/unit/UnitSerologyTest.vue';
import { discardReasonOptions } from '@/enums/Units';
import { useDonationStore } from '@/stores/donation/donations';
import { useSerologyTestStore } from '@/stores/laboratory/serologyTest';
import { useUnitStore } from '@/stores/storage/units';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const donationStore = useDonationStore();
const serologyStore = useSerologyTestStore();
const unitStore = useUnitStore();
const route = useRoute();

const donation = ref(null);
const serologyTest = ref(null);
const bloodType = ref(null);
const unit = ref(null);

const donationId = computed(() => route.query.donationId);
const unitId = computed(() => route.query.unitId);
const showReactiveWarning = ref(false);
const fieldPendingReset = ref(null);
const showDiscardModal = ref(false);

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
const openModalDiscard = () => {
  showDiscardModal.value = true;
};
const handleDiscardSave = async (reason) => {
  const response = await unitStore.discardUnit(unitId.value, reason);
  console.log('resp', response);
};

onMounted(async () => {
  const donationResponse = await donationStore.getDonation(donationId.value);
  const serologyTestResponse = await serologyStore.getSerologyTestByDonationId(donationId.value);
  const unitReponse = await unitStore.getUnitById(unitId.value);
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
        <Button class="h-10 w-full md:max-w-[16rem]" label="Descartar Unidad" severity="danger" @click="openModalDiscard" />
        <Button class="h-10 w-full md:max-w-[16rem]" label="Obtener Etiqueta" severity="success" />
      </div>
    </div>
    <UnitDiscardModal v-model="showDiscardModal" :reasons="discardReasonOptions" @save="handleDiscardSave" />
  </div>
</template>
