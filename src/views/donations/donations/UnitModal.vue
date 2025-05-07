<script setup>
import { useSampleUnitsStore } from '@/stores/donation/sample-units';
import { ref, watch } from 'vue';

const props = defineProps({
  unit: {
    type: Object,
    required: true
  }
});
const sampleUnitsStore = useSampleUnitsStore();

const showModal = defineModel({ type: Boolean, required: true });
const emit = defineEmits(['save']);

const localUnit = ref({ ...props.unit });
watch(
  () => props.unit,
  (newVal) => {
    localUnit.value = { ...newVal };
  }
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
    <div class="w-full flex flex-col gap-4 p-2">
      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="type" :options="sampleUnitsStore.unitTypes" optionLabel="label" optionValue="value" showClear v-model="localUnit.type" />
        <label for="type">Tipo de unidad</label>
      </FloatLabel>
      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="package" :options="sampleUnitsStore.unitPackages" optionLabel="label" optionValue="value" showClear v-model="localUnit.package" />
        <label for="package">Tipo de bolsa</label>
      </FloatLabel>
      <FloatLabel variant="on" class="w-full">
        <Select class="w-full" id="unit" :options="sampleUnitsStore.unitNames" optionLabel="label" optionValue="value" showClear v-model="localUnit.unit" />
        <label for="unit">Unidad</label>
      </FloatLabel>
      <FloatLabel variant="on" class="w-full">
        <InputText class="w-full" id="volume" v-model="localUnit.volume" />
        <label for="volume">Volumen</label>
      </FloatLabel>
    </div>

    <template #footer>
      <Button label="Cancelar" class="min-w-40 btn-clean" @click="close" />
      <Button label="Aceptar" class="min-w-40 p-button-success" @click="save" />
    </template>
  </Dialog>
</template>
