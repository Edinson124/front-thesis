<script setup>
// import DonationStatusCard from '@/components/donation/DonationStatusCard.vue';
import UnitCardStatus from '@/components/unit/UnitCardStatus.vue';
import UnitDiscardModal from '@/components/unit/UnitDiscardModal.vue';
import UnitInfoCard from '@/components/unit/UnitInfoCard.vue';
import UnitSerologyTest from '@/components/unit/UnitSerologyTest.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { discardReasonOptions } from '@/enums/Units';
import { useHematologicalTestStore } from '@/stores/laboratory/hematologicalTest';
import { useSerologyTestStore } from '@/stores/laboratory/serologyTest';
import { useUnitStore } from '@/stores/storage/units';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const serologyStore = useSerologyTestStore();
useHematologicalTestStore;
const unitStore = useUnitStore();
const route = useRoute();
const router = useRouter();

const serologyTest = ref(null);
const bloodType = ref(null);
const unit = ref(null);

const unitId = computed(() => route.query.unitId);
const showReactiveWarning = ref(false);
const fieldPendingReset = ref(null);
const canViewUnit = ref(false);

const showDiscardModal = ref(false);
const showSuccessDiscardModal = ref(false);
const showErrorDiscardModal = ref(false);

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
  if (response) {
    showDiscardModal.value = false;
    showSuccessDiscardModal.value = true;
    return;
  } else {
    showErrorDiscardModal.value = true;
  }
};

onMounted(async () => {
  const canViewResponse = await unitStore.canViewUnit(unitId.value);
  const unitReponse = await unitStore.getUnitById(unitId.value);
  const serologyTestResponse = await serologyStore.getSerologyTestByDonationId(unitReponse.donationId);
  canViewUnit.value = canViewResponse;
  unit.value = unitReponse;
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
    <div v-if="!canViewUnit">
      <div class="card felx justify-center items-center">
        <p class="text-red-500">Usted no tiene permisos para visualizar esta unidad</p>
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
    <SuccessModal id="succesDiscardUnit" v-model="showSuccessDiscardModal" message="La unidad ha sido descartada" @close="() => router.back()" />
    <ErrorModal id="errorDiscardUnit" v-model="showErrorDiscardModal" />
  </div>
</template>
