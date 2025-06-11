<script setup>
// import DonationStatusCard from '@/components/donation/DonationStatusCard.vue';
import UnitCardStatus from '@/components/unit/UnitCardStatus.vue';
import UnitInfoCard from '@/components/unit/UnitInfoCard.vue';
import UnitSerologyTest from '@/components/unit/UnitSerologyTest.vue';
import { useNetworCollaborationStore } from '@/stores/networks/networks';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const networkCollaborationStore = useNetworCollaborationStore();
const route = useRoute();
const router = useRouter();

const serologyTest = ref(null);
const bloodType = ref(null);
const unit = ref(null);

const canViewUnit = ref(null);
const networkId = computed(() => route.query.networkId);
const unitId = computed(() => route.query.unitId);
const shipmentId = computed(() => route.query.shipment);
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
const loadData = async () => {
  let response = null;
  isLoading.value = true;

  if (networkId.value && unitId.value) {
    response = await networkCollaborationStore.getUnitStock(unitId.value, networkId.value);
  } else if (shipmentId.value && unitId.value) {
    response = await networkCollaborationStore.getUnitShipment(unitId.value, shipmentId.value);
  }

  if (response) {
    canViewUnit.value = response.canViewUnit;
    unit.value = response.unit;
    serologyTest.value = response.serology;
    bloodType.value = unit.value.bloodType;
  }

  isLoading.value = false;
};

watch(
  () => route.query,
  () => {
    loadData();
  }
);
onMounted(async () => {
  loadData();
});
</script>

<template>
  <div v-if="isLoading" class="card absolute inset-0 bg-white/50 flex items-center justify-center z-10">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else class="card">
    <div v-if="!canViewUnit">
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
        <Button class="min-w-40 btn-clean" label="Regresar" @click="() => router.back()" />
      </div>
    </div>
  </div>
</template>
