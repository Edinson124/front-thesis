<script setup>
import BloodBankInfo from '@/components/network/BloodBankInfo.vue';
import UnitTable from '@/components/unit/UnitTable.vue';
import { reasonOptions } from '@/enums/ShipmentRequest';
import { useShipmentStore } from '@/stores/networks/shipments';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const shipmentStore = useShipmentStore();

// Variables reactivas
const networkSelected = ref(null);

const bloodBankSelected = ref(null);
const bloodBanksOption = ref([]);
const loadingNetwork = ref(false);

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
  console.log(unit);
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

const cancelar = () => {
  console.log('Operación cancelada');
  // Aquí iría la lógica para cancelar
};

const save = async () => {
  const isValid = await vRequest$.value.$validate();
  if (!isValid) return;
  await shipmentStore.createShipment(shipmentRequest);
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
    <UnitTable
      title="Unidades solicitadas"
      type="shipmentData"
      type-modal="request"
      subtype="shipment"
      :loading="loadingNetwork"
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
    <!-- <div class="flex flex-col sm:flex-row justify-end gap-2"> -->
    <!-- <Button label="Confirmar recepción" class="p-button-success" @click="confirmarRecepcion" /> -->
    <div class="flex justify-end mt-4 gap-2">
      <Button class="min-w-40 btn-clean" label="Cancelar" @click="cancelar" />
      <Button class="min-w-40 p-button-success" label="Guardar" @click="save" />
    </div>
    <!-- </div> -->
  </div>
</template>
