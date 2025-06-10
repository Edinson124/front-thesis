<script setup>
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import { minLength, required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, ref, watch } from 'vue';

const showSuitableUnitModal = ref(false);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  header: {
    type: String,
    default: 'Unidad Apta'
  },
  headerConfirm: {
    type: String,
    default: 'Unidad Apta'
  },
  message: {
    type: String,
    default: '¿Estás seguro de liberar la unidad de cuarentena?'
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const visible = ref(props.modelValue);
const stamp = ref(null);
const form = { stamp };

const rules = computed(() => ({
  stamp: { required: required('Sello de pronahebas'), minLength: minLength('Sello de pronahebas', 6) }
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
  stamp.value = null;
  v$.value.$reset();
}

const openModalConfirm = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;
  showSuitableUnitModal.value = true;
};

const emitSave = async () => {
  emit('save', stamp.value);
};
</script>

<template>
  <Dialog v-model:visible="visible" modal :header="header" :style="{ width: '400px' }">
    <div class="flex flex-col gap-4 mt-2">
      <div>
        <FloatLabel variant="on">
          <InputText v-model="stamp" class="w-full" :invalid="v$.stamp?.$error" />
          <label for="stamp" class="font-medium block mb-2">Sello pronahebas</label>
        </FloatLabel>
        <Message v-if="v$.stamp?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.stamp.$errors[0].$message }}</Message>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button class="h-10 btn-clean" label="Cancelar" @click="close" />
        <Button class="h-10" label="Guardar" severity="success" @click="openModalConfirm" />
      </div>
    </div>
  </Dialog>
  <ConfirmModal id="suitableUnitModal" v-model="showSuitableUnitModal" severity="warn" :header="headerConfirm" :message="message" accept-text="Aceptar" @accept="emitSave" />
</template>
