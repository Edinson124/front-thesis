<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const visible = ref(props.modelValue);
const selectedReason = ref(null);

const reasons = [
  { label: 'Vencimiento', value: 'expiration' },
  { label: 'Contaminación', value: 'contamination' },
  { label: 'Reactivo en pruebas', value: 'reactive' },
  { label: 'Otro', value: 'other' }
];

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
  }
);

watch(visible, (val) => {
  emit('update:modelValue', val);
});

function close() {
  visible.value = false;
  selectedReason.value = null;
}

function emitSave() {
  emit('save', selectedReason.value);
  close();
}
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Descartar unidad" :style="{ width: '400px' }">
    <div class="flex flex-col gap-4">
      <div>
        <label for="reason" class="font-medium block mb-2">Motivo</label>
        <Select v-model="selectedReason" :options="reasons" optionLabel="label" optionValue="value" placeholder="Seleccione un motivo" class="w-full" />
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button class="h-10 btn-clean" label="Cancelar" @click="close" />
        <Button class="h-10" label="Descartar" severity="danger" @click="emitSave" :disabled="!selectedReason" />
      </div>
    </div>
  </Dialog>
</template>
