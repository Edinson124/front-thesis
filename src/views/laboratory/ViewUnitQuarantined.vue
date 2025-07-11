<script setup>
// import DonationStatusCard from '@/components/donation/DonationStatusCard.vue';
import InfoDonation from '@/components/donation/InfoDonation.vue';
import InfoDonor from '@/components/donation/InfoDonor.vue';
import UnitCardStatus from '@/components/unit/UnitCardStatus.vue';
import UnitDiscardModal from '@/components/unit/UnitDiscardModal.vue';
import UnitSerologyTest from '@/components/unit/UnitSerologyTest.vue';
import UnitStampModal from '@/components/unit/UnitStampModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { RhFactor } from '@/enums/BloodType';
import { discardReasonQuarantinedOptions } from '@/enums/Units';
import { useDonationStore } from '@/stores/donation/donations';
import { useHematologicalTestStore } from '@/stores/laboratory/hematologicalTest';
import { useSerologyTestStore } from '@/stores/laboratory/serologyTest';
import { useUnitsQuarantinedStore } from '@/stores/laboratory/unitsQuarantined';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const donationStore = useDonationStore();
const serologyStore = useSerologyTestStore();
const hematologicStore = useHematologicalTestStore();
const unitsQuarantinedStore = useUnitsQuarantinedStore();
const route = useRoute();
const router = useRouter();

const donation = ref(null);
const hematologicTest = ref(null);
const serologyTest = ref(null);
const bloodType = ref(null);
const donationId = computed(() => route.query.donationId);
const unitId = computed(() => route.query.unitId);
const showReactiveWarning = ref(false);
const fieldPendingReset = ref(null);

const isLoading = ref(true);
const showDiscardModal = ref(false);
const showSuccessDiscardModal = ref(false);
const showErrorDiscardModal = ref(false);

const showSuitableModal = ref(false);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const verifyStampModal = ref(false);

const openModalDiscard = () => {
  showDiscardModal.value = true;
};
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

const returnUnitsQuarantined = () => {
  router.push('/laboratory/units/quarantined');
};

const unitSuitable = async (stamp) => {
  const success = await unitsQuarantinedStore.unitSuitable(unitId.value, stamp);
  if (success == 0) {
    verifyStampModal.value = true;
    return;
  } else if (success > 0) {
    showSuitableModal.value = false;
    showSuccessModal.value = true;
  } else {
    showErrorModal.value = true;
  }
};

const openModalUnitSuitable = () => {
  showSuitableModal.value = true;
};

const handleDiscardSave = async (reason) => {
  const response = await unitsQuarantinedStore.discardUnit(unitId.value, reason);
  if (response) {
    showDiscardModal.value = false;
    showSuccessDiscardModal.value = true;
    return;
  } else {
    showErrorDiscardModal.value = true;
  }
};

onMounted(async () => {
  const donationResponse = await donationStore.getDonation(donationId.value);
  const hematologicalTestResponse = await hematologicStore.getHematologicalTestByDonationId(donationId.value);
  const serologyTestResponse = await serologyStore.getSerologyTestByDonationId(donationId.value);
  donation.value = donationResponse;
  hematologicTest.value = hematologicalTestResponse;
  serologyTest.value = serologyTestResponse;
  bloodType.value = (hematologicTest.value?.bloodType ?? '') + (RhFactor[hematologicTest.value?.rhFactor]?.symbol ?? '');
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

      <UnitSerologyTest :serologyTest="serologyTest" :bloodType="bloodType" :hematologicTest="hematologicTest" :showBloodType="true" />

      <div v-if="serologyTest" class="flex justify-center px-8 my-8 gap-4">
        <Button v-if="serologyTest.status != 'REACTIVO'" class="h-10 w-full md:max-w-[16rem]" label="Unidad Apta" severity="success" @click="openModalUnitSuitable" />
        <Button class="h-10 w-full md:max-w-[16rem]" label="Descartar Unidad" severity="danger" @click="openModalDiscard" />
      </div>
    </div>
    <UnitDiscardModal v-model="showDiscardModal" :reasons="discardReasonQuarantinedOptions" @save="handleDiscardSave" />
    <SuccessModal id="succesDiscardUnit" v-model="showSuccessDiscardModal" message="La unidad ha sido descartada" @close="returnUnitsQuarantined" />
    <ErrorModal id="errorDiscardUnit" v-model="showErrorDiscardModal" />

    <UnitStampModal v-model="showSuitableModal" @save="unitSuitable" />
    <SuccessModal id="succesSuitableUnit" v-model="showSuccessModal" message="La unidad esta disponible en stock" @close="returnUnitsQuarantined" />
    <ErrorModal id="errorSuitableUnit" v-model="showErrorModal" />

    <ErrorModal id="errorVerifyUnit" v-model="verifyStampModal" header="Verificación sello pronahebas" message="El código del sello de Pronahebas no está disponible, esta asignado a otra unidad" more-message="" />
  </div>
</template>
