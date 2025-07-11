<script setup>
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, ref, watch } from 'vue';

const showConfirmDiscarUnit = ref(false);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  reasons: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const visible = ref(props.modelValue);
const selectedReason = ref(null);
const form = { selectedReason }; // Vuelidate espera un objeto con los datos

const rules = computed(() => ({
  selectedReason: { required: required('Motivo') }
}));

const v$ = useVuelidate(rules, form);

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

const openModalConfirm = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;
  showConfirmDiscarUnit.value = true;
};

const emitSave = async () => {
  emit('save', selectedReason.value);
};
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Descartar unidad" :style="{ width: '400px' }">
    <div class="flex flex-col gap-4 mt-2">
      <div>
        <FloatLabel variant="on">
          <Select v-model="selectedReason" :options="reasons" optionLabel="label" optionValue="value" class="w-full" filter :invalid="v$.selectedReason?.$error" />
          <label for="reason" class="font-medium block mb-2">Motivo</label>
        </FloatLabel>
        <Message v-if="v$.selectedReason?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.selectedReason.$errors[0].$message }}</Message>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button class="h-10 btn-clean" label="Cancelar" @click="close" />
        <Button class="h-10" label="Descartar" severity="danger" @click="openModalConfirm" />
      </div>
    </div>
  </Dialog>
  <ConfirmModal id="discardUnitConfirmModal" v-model="showConfirmDiscarUnit" severity="warn" header="Descartar unidad" message="¿Estás seguro de descartar la unidad?" accept-text="Descartar" accept-button-class="p-button-danger" @accept="emitSave" />
</template>
