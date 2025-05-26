<script setup>
import { anticoagulantOptions, bagTypesOptions, unitTypesCreateOptions, unitTypesOptions, unitTypesTransformationOptions } from '@/enums/Units';
import { ref, watch } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'creation' // 'transformation', 'request'
  },
  unit: {
    type: Object,
    required: true
  }
});

const showModal = defineModel({ type: Boolean, required: true });
const emit = defineEmits(['save']);

const localUnit = ref({ ...props.unit });
watch(
  () => props.unit,
  (newVal) => {
    localUnit.value = { ...newVal };
  },
  { deep: true }
);

const close = () => {
  showModal.value = false;
};

const save = () => {
  emit('save', localUnit.value);
  close();
};
</script>

<template>
  <Dialog v-model:visible="showModal" header="Unidad hematológica" modal class="w-[30rem]">
    <div class="w-full flex flex-col gap-4 p-2" v-if="type !== 'request'">
      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="type" :options="type === 'creation' ? unitTypesCreateOptions : unitTypesTransformationOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.type" />
        <label for="type">Tipo de unidad</label>
      </FloatLabel>
      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="package" :options="bagTypesOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.bag" />
        <label for="package">Tipo de bolsa</label>
      </FloatLabel>
      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="unit" :options="anticoagulantOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.anticoagulant" />
        <label for="unit">Anticoagulante</label>
      </FloatLabel>
      <FloatLabel variant="on" class="w-full">
        <InputText class="w-full" id="volume" v-model="localUnit.volume" />
        <label for="volume">Volumen</label>
      </FloatLabel>
    </div>
    <div class="w-full flex flex-col gap-4 p-2" v-else>
      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="type" :options="unitTypesOptions" optionLabel="label" optionValue="value" showClear v-model="localUnit.unitType" />
        <label for="type">Tipo de unidad</label>
      </FloatLabel>
      <FloatLabel variant="on" class="w-full">
        <InputText class="w-full" id="requested_quantity" v-model="localUnit.requestedQuantity" />
        <label for="requested_quantity">Cantidad</label>
      </FloatLabel>
    </div>

    <template #footer>
      <Button label="Cancelar" class="min-w-40 btn-clean" @click="close" />
      <Button label="Aceptar" class="min-w-40 p-button-success" @click="save" />
    </template>
  </Dialog>
</template>
