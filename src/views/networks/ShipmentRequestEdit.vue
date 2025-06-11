<script setup>
import BloodBankInfo from '@/components/network/BloodBankInfo.vue';
import UnitTableAssignShipment from '@/components/unit/UnitTableAssignShipment.vue';
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { reasonOptions } from '@/enums/ShipmentRequest';
import { useShipmentStore } from '@/stores/networks/shipments';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const shipmentStore = useShipmentStore();

const showConfirmShipmentModal = ref(false);
const showSuccessShipmentModal = ref(false);
const showErrorShipmentModal = ref(false);

const showCancelConfirmDialog = ref(false);

const deleteUnitRequestModal = ref(false);
const unitRequestDelete = ref(null);

const showConfirmSendModal = ref(false);
const showSuccessSendModal = ref(false);
const showErrorSendModal = ref(false);

const shipmentId = computed(() => route.params.id);
const bloodBank = ref(null);
const isLoading = ref(false);
const canViewRequest = ref(null);

const shipmentRequest = reactive({
  reason: null,
  details: null,
  units: []
});

const rulesRequest = computed(() => ({
  reason: { required: required('Motivo') }
}));

const vRequest$ = useVuelidate(rulesRequest, shipmentRequest, { $scope: false });

const addRequestedUnit = async (unit) => {
  const newUnit = {
    id: shipmentRequest.units.length + 1,
    unitType: unit.unitType,
    requestedQuantity: unit.requestedQuantity,
    bloodGroup: unit.bloodGroup,
    rhFactor: unit.rhFactor
  };
  shipmentRequest.units.push(newUnit);
};

const editRequestedUnit = async (index, updatedUnit) => {
  shipmentRequest.units[index] = {
    ...shipmentRequest.units[index],
    unitType: updatedUnit.unitType,
    requestedQuantity: updatedUnit.requestedQuantity,
    bloodGroup: updatedUnit.bloodGroup,
    rhFactor: updatedUnit.rhFactor
  };
};

const removeRequestedUnit = async () => {
  shipmentRequest.units.splice(unitRequestDelete.value, 1);
  unitRequestDelete.value = null;
};

const openRemoveModal = async (index) => {
  unitRequestDelete.value = index;
  deleteUnitRequestModal.value = true;
};

const returnMyShipments = () => {
  router.push({
    path: '/networks/myShipments'
  });
};

const cancel = () => {
  showCancelConfirmDialog.value = true;
};
const send = async () => {
  const response = await shipmentStore.sendShipment(shipmentId.value);
  if (response) {
    showSuccessSendModal.value = true;
  } else {
    showErrorSendModal.value = true;
  }
};

const openModalsend = async () => {
  showConfirmSendModal.value = true;
};

const saveShipment = async () => {
  const response = await shipmentStore.editShipment(shipmentId.value, shipmentRequest);
  if (response) {
    showSuccessShipmentModal.value = true;
  } else {
    showErrorShipmentModal.value = true;
  }
};

const handleSave = async () => {
  const isValid = await vRequest$.value.$validate();
  if (!isValid) return;
  showConfirmShipmentModal.value = true;
};

onMounted(async () => {
  isLoading.value = true;
  const response = await shipmentStore.getShipment(shipmentId.value);
  canViewRequest.value = response.canViewRequest;
  bloodBank.value = response.bloodBankOrigin;
  shipmentRequest.reason = response.shipmentRequest.reason;
  shipmentRequest.details = response.shipmentRequest.details;
  shipmentRequest.units = response.units;
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
      <h1 class="text-2xl font-bold mb-4">Solicitar Tranferencia</h1>

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
      <UnitTableAssignShipment
        title="Unidades solicitadas"
        type="shipmentData"
        type-modal="request"
        subtype="shipment"
        :loading="isLoading"
        v-model="shipmentRequest.units"
        @edit="(index, unit) => editRequestedUnit(index, unit)"
        @add="(unit) => addRequestedUnit(unit)"
        @remove="(unit) => openRemoveModal(unit)"
      />

      <!-- Motivo -->
      <div class="mb-6">
        <h4 class="mb-3">Motivo</h4>

        <div class="space-y-4">
          <div>
            <FloatLabel variant="on">
              <Select v-model="shipmentRequest.reason" :options="reasonOptions" optionLabel="label" optionValue="value" id="reason" class="w-full md:w-1/2" :invalid="vRequest$.reason?.$error" />
              <label for="reason">Motivo</label>
            </FloatLabel>
            <Message v-if="vRequest$.reason?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vRequest$.reason.$errors[0].$message }}</Message>
          </div>

          <div>
            <FloatLabel variant="on">
              <Textarea v-model="shipmentRequest.details" id="details" rows="4" class="w-full resize-none" />
              <label for="details">Detalle</label>
            </FloatLabel>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex flex-col sm:flex-row justify-between gap-2">
        <Button class="min-w-40 p-button-success mt-4" label="Solicitar" @click="openModalsend" />
        <div class="flex justify-end mt-4 gap-2">
          <Button class="min-w-40 btn-clean" label="Cancelar" @click="cancel" />
          <Button class="min-w-40 p-button-success" label="Guardar" @click="handleSave" />
        </div>
      </div>
    </div>
  </div>
  <ConfirmModal
    id="deleteUnitRequestModal"
    v-model="deleteUnitRequestModal"
    severity="warn"
    header="Eliminar unidad asignada a la solicitud de transferencia"
    :message="`¿Estás seguro de eliminar la soliciud de esa unidad?`"
    accept-text="Eliminar"
    accept-button-class="p-button-danger"
    @accept="removeRequestedUnit"
  />

  <ConfirmModal v-model="showConfirmShipmentModal" header="¿Estás seguro de guardar la solicitud de transeferencia?" accept-text="Guardar" @accept="saveShipment" />
  <SuccessModal v-model="showSuccessShipmentModal" message="La solicitud fue guardado con éxito. Hacer click en 'Editar' y luego 'Solicitar' para enviarlo al banco de sangre" @close="returnMyShipments" />
  <ErrorModal v-model="showErrorShipmentModal" />

  <ConfirmModal id="showSendModalDialog" v-model="showConfirmSendModal" header="¿Estás seguro de enviar la solicitud al banco de sangre destino?" accept-text="Guardar" @accept="send" />
  <SuccessModal id="showSucessSendDialog" v-model="showSuccessSendModal" message="La solicitud fue enviada con éxito. " @close="returnMyShipments" />
  <ErrorModal id="showErrorSendDialog" v-model="showErrorSendModal" />

  <ConfirmModal id="cancelConfirmDialog" v-model="showCancelConfirmDialog" header="¿Estás seguro de que deseas cancelar la operación?" accept-text="Sí" accept-button-class="p-button-danger" @accept="returnMyShipments" reject-text="No" />
</template>
