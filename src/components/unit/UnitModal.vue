<script setup>
import { anticoagulantOptions, bagTypesOptions, unitTypesCreateOptions, unitTypesOptions, unitTypesTransformationOptions } from '@/enums/Units';
import { rhFactorOptions, bloodGroupOptions } from '@/enums/BloodType';
import { ref, watch } from 'vue';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';

const props = defineProps({
  type: {
    type: String,
    default: 'creation' // 'transformation', 'request'
  },
  subtype: {
    type: String,
    default: null //'shipment'
  },
  unit: {
    type: Object,
    required: true
  }
});

import { computed } from 'vue';

const rulesShipment = computed(() => {
  if (props.type === 'request') {
    const base = {
      unitType: { required: required('Tipo de unidad') },
      requestedQuantity: { required: required('Cantidad') }
    };

    if (props.subtype === 'shipment') {
      base.bloodGroup = { required: required('Grupo sanguíneo') };
      base.rhFactor = { required: required('Rh') };
    }

    return base;
  }

  return {
    type: { required: required('Tipo de unidad') },
    bag: { required: required('Tipo de bolsa') },
    anticoagulant: { required: required('Anticoagulante') },
    volume: { required: required('Volumen') }
  };
});

const showModal = defineModel({ type: Boolean, required: true });
const emit = defineEmits(['save']);

const localUnit = ref({ ...props.unit });
watch(
  () => props.unit,
  (newVal) => {
    Object.assign(localUnit.value, newVal);
  },
  { deep: true }
);
const vShipment$ = useVuelidate(rulesShipment, localUnit.value, { $scope: false });
const close = () => {
  showModal.value = false;
};

const save = async () => {
  const isValid = await vShipment$.value.$validate();
  if (!isValid) return;
  emit('save', localUnit.value);
  close();
};
</script>

<template>
  <Dialog v-model:visible="showModal" header="Unidad hematológica" modal class="w-[30rem]">
    <div class="w-full flex flex-col gap-4 p-2" v-if="type !== 'request'">
      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="type" :options="type === 'creation' ? unitTypesCreateOptions : unitTypesTransformationOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.type" :invalid="vShipment$.type?.$error" />
        <label for="type">Tipo de unidad</label>
      </FloatLabel>
      <Message v-if="vShipment$.type?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vShipment$.type.$errors[0].$message }}</Message>

      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="package" :options="bagTypesOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.bag" :invalid="vShipment$.bag?.$error" />
        <label for="package">Tipo de bolsa</label>
      </FloatLabel>
      <Message v-if="vShipment$.bag?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vShipment$.bag.$errors[0].$message }}</Message>

      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="unit" :options="anticoagulantOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.anticoagulant" :invalid="vShipment$.anticoagulant?.$error" />
        <label for="unit">Anticoagulante</label>
      </FloatLabel>
      <Message v-if="vShipment$.anticoagulant?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vShipment$.anticoagulant.$errors[0].$message }}</Message>

      <FloatLabel variant="on" class="w-full">
        <InputText class="w-full" id="volume" v-model="localUnit.volume" :invalid="vShipment$.volume?.$error" />
        <label for="volume">Volumen</label>
      </FloatLabel>
      <Message v-if="vShipment$.volume?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vShipment$.volume.$errors[0].$message }}</Message>
    </div>
    <div class="w-full flex flex-col gap-4 p-2" v-else>
      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="type" :options="unitTypesOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.unitType" :invalid="vShipment$.unitType?.$error" />
        <label for="type">Tipo de unidad</label>
      </FloatLabel>
      <Message v-if="vShipment$.unitType?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vShipment$.unitType.$errors[0].$message }}</Message>

      <FloatLabel variant="on" class="w-full">
        <InputText class="w-full" id="requested_quantity" v-model="localUnit.requestedQuantity" :invalid="vShipment$.requestedQuantity?.$error" />
        <label for="requested_quantity">Cantidad</label>
      </FloatLabel>
      <Message v-if="vShipment$.requestedQuantity?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vShipment$.requestedQuantity.$errors[0].$message }}</Message>

      <div class="w-full flex flex-col gap-4" v-if="subtype == 'shipment'">
        <FloatLabel variant="on" class="w-full">
          <Select class="w-full" id="requested_blood_type" :options="bloodGroupOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.bloodGroup" :invalid="vShipment$.bloodGroup?.$error" />
          <label for="requested_blood_type">Grupo sanguíneo</label>
        </FloatLabel>
        <Message v-if="vShipment$.bloodGroup?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vShipment$.bloodGroup.$errors[0].$message }}</Message>

        <FloatLabel variant="on" class="w-full">
          <Select class="w-full" id="requested_rh" :options="rhFactorOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.rhFactor" :invalid="vShipment$.rhFactor?.$error" />
          <label for="requested_rh">Rh factor</label>
        </FloatLabel>
        <Message v-if="vShipment$.rhFactor?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vShipment$.rhFactor.$errors[0].$message }}</Message>
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" class="min-w-40 btn-clean" @click="close" />
      <Button label="Aceptar" class="min-w-40 p-button-success" @click="save" />
    </template>
  </Dialog>
</template>
