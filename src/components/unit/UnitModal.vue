<script setup>
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import { anticoagulantOptions, bagTypesOptions, unitTypesCreateOptions, unitTypesOptions, unitTypesTransformationOptions, unitTypesTransformationOptionsPFC } from '@/enums/Units';
import { rhFactorOptions, bloodGroupOptions } from '@/enums/BloodType';
import { ref, watch, computed } from 'vue';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';

const showConfirmUnitModal = ref(false);

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
  },
  typeUnit: {
    type: String,
    default: null
  }
});
const messageConfirm = computed(() => {
  if (props.type === 'request') {
    return '¿Estás seguro de agregar esta solicitud de unidades?';
  } else {
    return '¿Estás seguro de guardar la unidad?';
  }
});

const OPTIONS = computed(() => {
  if (props.typeUnit === 'Sangre total') {
    return unitTypesTransformationOptions;
  } else {
    return unitTypesTransformationOptionsPFC;
  }
});

const rulesUnitModal = computed(() => {
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

const resetLocalUnit = () => {
  localUnit.value = { ...props.unit }; // Si quieres volver al estado original
  vUnitModal$.value.$reset(); // Limpia los errores de validación
};

const vUnitModal$ = useVuelidate(rulesUnitModal, localUnit.value, { $scope: false });
const close = () => {
  resetLocalUnit();
  showModal.value = false;
};

const emitSave = async () => {
  emit('save', localUnit.value);
  close();
};

const save = async () => {
  const isValid = await vUnitModal$.value.$validate();
  if (!isValid) return;
  showConfirmUnitModal.value = true;
};
</script>

<template>
  <Dialog v-model:visible="showModal" header="Unidad hematológica" modal class="w-[30rem]">
    <div class="w-full flex flex-col gap-4 p-2" v-if="type !== 'request'">
      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="type" :options="type === 'creation' ? unitTypesCreateOptions : OPTIONS" optionLabel="label" optionValue="value" showClear v-model="localUnit.type" :invalid="vUnitModal$.type?.$error" />
        <label for="type">Tipo de unidad</label>
      </FloatLabel>
      <Message v-if="vUnitModal$.type?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vUnitModal$.type.$errors[0].$message }}</Message>

      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="package" :options="bagTypesOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.bag" :invalid="vUnitModal$.bag?.$error" />
        <label for="package">Tipo de bolsa</label>
      </FloatLabel>
      <Message v-if="vUnitModal$.bag?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vUnitModal$.bag.$errors[0].$message }}</Message>

      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="unit" :options="anticoagulantOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.anticoagulant" :invalid="vUnitModal$.anticoagulant?.$error" />
        <label for="unit">Anticoagulante</label>
      </FloatLabel>
      <Message v-if="vUnitModal$.anticoagulant?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vUnitModal$.anticoagulant.$errors[0].$message }}</Message>

      <FloatLabel variant="on" class="w-full">
        <InputText class="w-full" id="volume" v-model="localUnit.volume" :invalid="vUnitModal$.volume?.$error" />
        <label for="volume">Volumen</label>
      </FloatLabel>
      <Message v-if="vUnitModal$.volume?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vUnitModal$.volume.$errors[0].$message }}</Message>
    </div>
    <div class="w-full flex flex-col gap-4 p-2" v-else>
      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="type" :options="unitTypesOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.unitType" :invalid="vUnitModal$.unitType?.$error" />
        <label for="type">Tipo de unidad</label>
      </FloatLabel>
      <Message v-if="vUnitModal$.unitType?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vUnitModal$.unitType.$errors[0].$message }}</Message>

      <FloatLabel variant="on" class="w-full">
        <InputText class="w-full" id="requested_quantity" v-model="localUnit.requestedQuantity" :invalid="vUnitModal$.requestedQuantity?.$error" />
        <label for="requested_quantity">Cantidad</label>
      </FloatLabel>
      <Message v-if="vUnitModal$.requestedQuantity?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vUnitModal$.requestedQuantity.$errors[0].$message }}</Message>

      <div class="w-full flex flex-col gap-4" v-if="subtype == 'shipment'">
        <FloatLabel variant="on" class="w-full">
          <Select class="w-full" id="requested_blood_type" :options="bloodGroupOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.bloodGroup" :invalid="vUnitModal$.bloodGroup?.$error" />
          <label for="requested_blood_type">Grupo sanguíneo</label>
        </FloatLabel>
        <Message v-if="vUnitModal$.bloodGroup?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vUnitModal$.bloodGroup.$errors[0].$message }}</Message>

        <FloatLabel variant="on" class="w-full">
          <Select class="w-full" id="requested_rh" :options="rhFactorOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.rhFactor" :invalid="vUnitModal$.rhFactor?.$error" />
          <label for="requested_rh">Rh factor</label>
        </FloatLabel>
        <Message v-if="vUnitModal$.rhFactor?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ vUnitModal$.rhFactor.$errors[0].$message }}</Message>
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" class="min-w-40 btn-clean" @click="close" />
      <Button label="Aceptar" class="min-w-40 p-button-success" @click="save" />
    </template>
  </Dialog>
  <ConfirmModal id="confirmSaveUnitModal" v-model="showConfirmUnitModal" :header="messageConfirm" accept-text="Guardar" @accept="emitSave" />
</template>
