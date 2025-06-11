<script setup>
import BloodBankInfo from '@/components/network/BloodBankInfo.vue';
import UnitTableAssignShipment from '@/components/unit/UnitTableAssignShipment.vue';
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { useShipmentStore } from '@/stores/networks/shipments';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const shipmentStore = useShipmentStore();

const shipmentId = computed(() => route.params.id);
const bloodBank = ref(null);
const isLoading = ref(true);
const canViewRequest = ref(null);
const shipment = ref(null);

const showReceptionUnitModal = ref(false);
const showSuccessReceptionUnitModal = ref(false);
const showErrorReceptionUnitModal = ref(false);

const shipmentRequest = reactive({
  reason: null,
  details: null,
  units: [],
  assignment: []
});

const returnBack = () => {
  router.push({
    path: '/networks/myShipments'
  });
};

const confirmReception = async () => {
  const response = await shipmentStore.confirmReception(shipmentId.value);
  if (response) {
    showSuccessReceptionUnitModal.value = true;
  } else {
    showErrorReceptionUnitModal.value = true;
  }
};
const openConfirmModal = async () => {
  showReceptionUnitModal.value = true;
};

const viewUnit = (unit) => {
  router.push({
    path: '/networks/stock/unit',
    query: { unitId: unit.idUnit, shipment: shipmentId.value }
  });
};

onMounted(async () => {
  isLoading.value = true;
  const response = await shipmentStore.getShipmentWithAssignmentView(shipmentId.value);
  canViewRequest.value = response.canViewRequest;
  if (canViewRequest.value) {
    bloodBank.value = response.bloodBankOrigin;
    shipmentRequest.reason = response.shipmentRequest.reason;
    shipmentRequest.details = response.shipmentRequest.details;
    shipmentRequest.units = response.units;
    shipmentRequest.assignment = response.assignment;
    shipment.value = response.shipmentRequest;
  }
  isLoading.value = false;
});
</script>
<template>
  <div v-if="isLoading" class="card absolute inset-0 bg-white/50 flex items-center justify-center z-10">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else class="card">
    <div v-if="!canViewRequest">
      <div class="card felx justify-center items-center">
        <p class="text-red-500">Usted no tiene permisos para visualizar esta solicitud</p>
      </div>
    </div>
    <div v-else>
      <h1 class="text-2xl font-bold mb-4">Visualizar solicitud de tranferencia</h1>

      <!-- Campos de Red y Banco de sangre -->
      <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <FloatLabel variant="on">
            <Select v-model="networkSelected" :options="shipmentStore.networkOptions" optionLabel="name" id="network" class="w-full" filter showClear @change="onNetworkChange" />
            <label for="network">Red</label>
          </FloatLabel>
        </div>
      </div> -->

      <!-- Datos del banco de sangre -->
      <BloodBankInfo :blood-bank="bloodBank" />

      <!-- Unidades solicitadas -->
      <UnitTableAssignShipment title="Unidades solicitadas" type="shipmentData" type-modal="request" subtype="shipment" :loading="isLoading" :read-only="true" v-model="shipmentRequest.units" />

      <!-- Motivo -->
      <div class="mb-6">
        <h4 class="mb-3">Motivo</h4>

        <div class="space-y-4">
          <div><span class="font-medium">Motivo:</span> {{ shipmentRequest.reason }}</div>
          <div><span class="font-medium">Detalle:</span> {{ shipmentRequest.details }}</div>
        </div>
      </div>

      <!-- Unidades asignada -->
      <UnitTableAssignShipment class="my-4" title="Unidades asignadas" type="shipmentDataAssign" type-modal="assign" subtype="shipment" :read-only="true" :loading="isLoading" v-model="shipmentRequest.assignment" @view="(unit) => viewUnit(unit)" />

      <!-- Botones de acción -->
      <div :class="['flex flex-col sm:flex-row gap-2', shipment.status === 'Liberado' ? 'justify-between' : 'justify-end']">
        <Button v-if="shipment.status === 'Liberado'" class="min-w-40 p-button-success mt-4" label="Confirmar recepción" @click="openConfirmModal" />
        <div class="flex justify-end mt-4 gap-2">
          <Button class="min-w-40 btn-clean" label="Regresar" @click="returnBack" />
          <!-- <Button class="min-w-40 p-button-success" label="Guardar" @click="save" /> -->
        </div>
      </div>
    </div>
  </div>
  <ConfirmModal id="showReceptionUnitModal" v-model="showReceptionUnitModal" header="¿Estás seguro de confirmar la recepción de las unidades a tu banco de sangre?" accept-text="Guardar" @accept="confirmReception" />
  <SuccessModal id="showSuccessReceptionUnitModal" v-model="showSuccessReceptionUnitModal" message="La recepcción se ha guardado con éxito" @close="returnBack" />
  <ErrorModal id="showErrorReceptionUnitModal" v-model="showErrorReceptionUnitModal" />
</template>
