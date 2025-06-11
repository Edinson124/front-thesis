<script setup>
import BloodBankInfo from '@/components/network/BloodBankInfo.vue';
import UnitTableAssignShipment from '@/components/unit/UnitTableAssignShipment.vue';
import { reasonOptions } from '@/enums/ShipmentRequest';
import { useShipmentStore } from '@/stores/networks/shipments';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const shipmentStore = useShipmentStore();

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
const removeRequestedUnit = async (index) => {
  shipmentRequest.units.splice(index, 1);
};

const cancelar = () => {
  router.push({
    path: '/networks/myShipments'
  });
};
const send = async () => {
  await shipmentStore.sendShipment(shipmentId.value);
  router.push({
    path: '/networks/myShipments'
  });
};

const save = async () => {
  const isValid = await vRequest$.value.$validate();
  if (!isValid) return;
  await shipmentStore.editShipment(shipmentId.value, shipmentRequest);
  router.push({
    path: '/networks/myShipments'
  });
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
        @remove="(unit) => removeRequestedUnit(unit)"
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
        <Button class="min-w-40 p-button-success mt-4" label="Solicitar" @click="send" />
        <div class="flex justify-end mt-4 gap-2">
          <Button class="min-w-40 btn-clean" label="Cancelar" @click="cancelar" />
          <Button class="min-w-40 p-button-success" label="Guardar" @click="save" />
        </div>
      </div>
    </div>
  </div>
</template>
