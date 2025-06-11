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
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const shipmentStore = useShipmentStore();

// Variables reactivas
const networkSelected = ref(null);

const bloodBankSelected = ref(null);
const bloodBanksOption = ref([]);
const loadingNetwork = ref(false);

const showConfirmShipmentModal = ref(false);
const showSuccessShipmentModal = ref(false);
const showErrorShipmentModal = ref(false);

const showCancelConfirmDialog = ref(false);

const deleteUnitRequestModal = ref(false);
const unitRequestDelete = ref(null);

const shipmentRequest = reactive({
  idBloodBank: null,
  reason: null,
  details: null,
  units: []
});

const rulesRequest = computed(() => ({
  idBloodBank: { required: required('Banco de sangre') },
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

// Métodos
const onNetworkChange = () => {
  if (networkSelected.value) {
    bloodBanksOption.value = networkSelected.value.bloodBankDetails ?? [];
    bloodBankSelected.value = null;
  } else {
    bloodBanksOption.value = [];
    bloodBankSelected.value = null;
  }
};

const returnMyShipments = () => {
  router.push({
    path: '/networks/myShipments'
  });
};

const cancel = () => {
  showCancelConfirmDialog.value = true;
};

const saveShipment = async () => {
  const response = await shipmentStore.createShipment(shipmentRequest);
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

watch(bloodBankSelected, (newVal) => {
  shipmentRequest.idBloodBank = newVal?.id ?? null;
});

onMounted(async () => {
  loadingNetwork.value = true;
  await shipmentStore.getShipmentsNetwork();
  loadingNetwork.value = false;
});
</script>
<template>
  <div class="card">
    <h1 class="text-2xl font-bold mb-6">Solicitar Tranferencia</h1>

    <!-- Campos de Red y Banco de sangre -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <FloatLabel variant="on">
          <Select v-model="networkSelected" :options="shipmentStore.networkOptions" optionLabel="name" id="network" class="w-full" filter showClear @change="onNetworkChange" />
          <label for="network">Red</label>
        </FloatLabel>
      </div>
      <div>
        <FloatLabel variant="on">
          <Select v-model="bloodBankSelected" :options="bloodBanksOption" optionLabel="name" id="bloodBank" class="w-full" filter showClear :disabled="!networkSelected" :invalid="vRequest$.idBloodBank?.$error" />
          <label for="bloodBank">Banco de sangre</label>
        </FloatLabel>
        <Message v-if="vRequest$.idBloodBank?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vRequest$.idBloodBank.$errors[0].$message }}</Message>
      </div>
    </div>

    <!-- Datos del banco de sangre -->
    <BloodBankInfo :blood-bank="bloodBankSelected" />

    <!-- Unidades solicitadas -->
    <UnitTableAssignShipment
      title="Unidades solicitadas"
      type="shipmentData"
      type-modal="request"
      subtype="shipment"
      :loading="loadingNetwork"
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
    <!-- <div class="flex flex-col sm:flex-row justify-end gap-2"> -->
    <!-- <Button label="Confirmar recepción" class="p-button-success" @click="confirmarRecepcion" /> -->
    <div class="flex justify-end mt-4 gap-2">
      <Button class="min-w-40 btn-clean" label="Cancelar" @click="cancel" />
      <Button class="min-w-40 p-button-success" label="Guardar" @click="handleSave" />
    </div>
    <!-- </div> -->
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
  <SuccessModal v-model="showSuccessShipmentModal" message="La solicitud fue guardado con éxito. Hacer click en 'Edita' y luego 'Solicitar' para enviarlo al banco de sangre" @close="returnMyShipments" />
  <ErrorModal v-model="showErrorShipmentModal" />

  <ConfirmModal id="cancelConfirmDialog" v-model="showCancelConfirmDialog" header="¿Estás seguro de que deseas cancelar la operación?" accept-text="Sí" accept-button-class="p-button-danger" @accept="returnMyShipments" reject-text="No" />
</template>
