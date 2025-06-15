<script setup>
import BloodBankInfo from '@/components/network/BloodBankInfo.vue';
import UnitTableAssignShipment from '@/components/unit/UnitTableAssignShipment.vue';
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { shipmentStatusAssignPermit } from '@/enums/Status';
import { useShipmentAssignmentStore } from '@/stores/networks/shipmentAssignment';
import { useShipmentStore } from '@/stores/networks/shipments';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const shipmentStore = useShipmentStore();
const shipmentAssignStore = useShipmentAssignmentStore();

const shipmentId = computed(() => route.params.id);
const bloodBank = ref(null);
const isLoading = ref(false);
const canViewRequest = ref(null);
const shipment = ref(null);
const assignPermit = ref(null);
const readOnly = ref(false);

const unitAssignIndex = ref(false);
const unitAssign = ref(false);

const deleteUnitAssignModal = ref(false);
const showSucessDeleteUnitAssignModal = ref(false);
const showErrorDeleteUnitAssignModal = ref(false);

const showFreeUnitModal = ref(false);
const showSuccessFreeUnitModal = ref(false);
const showErrorFreeUnitModal = ref(false);

const shipmentRequest = reactive({
  reason: null,
  details: null,
  units: [],
  assignment: []
});

const closeSuccesDelete = () => {
  showSucessDeleteUnitAssignModal.value = false;
};

const returnBack = () => {
  router.push({
    path: '/networks/Shipments'
  });
};

const assignShipmentUnit = async (unit) => {
  const shipmentAssignmentResponse = await shipmentAssignStore.saveShipmentAssignment(shipmentId.value, unit.id);
  shipmentRequest.assignment.push(shipmentAssignmentResponse);
};

const removeShipmentUnit = async () => {
  const response = await shipmentAssignStore.deleteShipmentAssignment(unitAssign.value.id);
  if (response) {
    shipmentRequest.assignment.splice(unitAssignIndex.value, 1);
    unitAssignIndex.value = null;
    unitAssign.value = null;
    showSucessDeleteUnitAssignModal.value = true;
  } else {
    showErrorDeleteUnitAssignModal.value = true;
  }
};

const openRemoveModal = async (index, assign) => {
  unitAssignIndex.value = index;
  unitAssign.value = assign;
  deleteUnitAssignModal.value = true;
};

const freeUnit = async () => {
  const response = await shipmentStore.freeUnit(shipmentId.value);
  if (response) {
    showSuccessFreeUnitModal.value = true;
  } else {
    showErrorFreeUnitModal.value = true;
  }
};

const openModalFree = async () => {
  showFreeUnitModal.value = true;
};

onMounted(async () => {
  isLoading.value = true;
  const response = await shipmentStore.getShipmentWithAssignmentResponse(shipmentId.value);
  canViewRequest.value = response.canViewRequest;
  if (canViewRequest.value) {
    bloodBank.value = response.bloodBankDestination;
    shipmentRequest.reason = response.shipmentRequest.reason;
    shipmentRequest.details = response.shipmentRequest.details;
    shipmentRequest.units = response.units;
    shipmentRequest.assignment = response.assignment;
    shipment.value = response.shipmentRequest;
    assignPermit.value = shipmentStatusAssignPermit.includes(response.shipmentRequest.status);
    readOnly.value = ['Liberado', 'Finalizado'].includes(response.shipmentRequest.status);
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
      <div class="mb-4 flex flex-wrap justify-between items-center gap-2">
        <h1 class="text-2xl font-bold mb-4">Visualizar solicitud de tranferencia</h1>
        <Button v-if="!readOnly" class="h-8 w-full md:grow md:max-w-[16rem]" label="Rechazar solicitud" severity="danger" @click="openDeferralDonorModal()" />
      </div>

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
      <UnitTableAssignShipment
        class="my-4"
        title="Unidades asignadas"
        type="shipmentDataAssign"
        type-modal="assign"
        subtype="shipment"
        :assign-permit="assignPermit"
        :loading="isLoading"
        :readOnly="readOnly"
        v-model="shipmentRequest.assignment"
        @add="(unit) => assignShipmentUnit(unit)"
        @remove="(index, assign) => openRemoveModal(index, assign)"
      />

      <!-- Botones de acción -->
      <div :class="['flex flex-col sm:flex-row gap-2', shipment.status === 'Solicitado' ? 'justify-between' : 'justify-end']">
        <Button v-if="shipment.status === 'Solicitado'" class="min-w-40 p-button-success mt-4" label="Liberar unidades" @click="openModalFree" />
        <div class="flex justify-end mt-4 gap-2">
          <Button class="min-w-40 btn-clean" label="Regresar" @click="returnBack" />
          <!-- <Button class="min-w-40 p-button-success" label="Guardar" @click="save" /> -->
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    id="deleteUnitAssign"
    v-model="deleteUnitAssignModal"
    severity="warn"
    header="Eliminar unidad asignada a la solicitud de transferencia"
    :message="`¿Estás seguro de eliminar la soliciud de esa unidad?`"
    accept-text="Eliminar"
    accept-button-class="p-button-danger"
    @accept="removeShipmentUnit"
  />
  <SuccessModal v-model="showSucessDeleteUnitAssignModal" message="La unidad fue desasignada de la solicitud, paso a estar disponible en el stock" @close="closeSuccesDelete" />
  <ErrorModal v-model="showErrorDeleteUnitAssignModal" />

  <ConfirmModal id="showFreeUnitModal" v-model="showFreeUnitModal" header="¿Estás seguro de confirmar el envió de las unidades hacia el banco de sangre destino?" accept-text="Guardar" @accept="freeUnit" />
  <SuccessModal id="showSuccessFreeUnitModal" v-model="showSuccessFreeUnitModal" message="El envío se ha guardado con éxito" @close="returnBack" />
  <ErrorModal id="showErrorFreeUnitModal" v-model="showErrorFreeUnitModal" />
</template>
