<script setup>
import { resultTestOptions } from '@/enums/ResultTransfusion';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@/validation/validators';
import { reactive, computed } from 'vue';

const result = reactive({ type: '', observation: '' });

const rules = computed(() => ({
  type: { required: required('Resultado') }
}));

const v$ = useVuelidate(rules, result);

const showModal = defineModel({ type: Boolean, required: true });
const emit = defineEmits(['save']);

const close = () => {
  showModal.value = false;
};

const save = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;
  emit('save', result);
  close();
};

const cancel = async () => {
  result.observation = '';
  result.type = '';
  close();
};
</script>

<template>
  <Dialog v-model:visible="showModal" header="Registrar resultado prueba cruzada" modal class="w-[30rem] p-2">
    <div>
      <FloatLabel variant="on" class="mt-4">
        <Select id="resultType" v-model="result.type" :options="resultTestOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.type?.$error" />
        <label for="resultType">Resultado</label>
      </FloatLabel>
      <Message v-if="v$.type?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.type.$errors[0].$message }}</Message>

      <FloatLabel variant="on" class="mt-4 w-full">
        <InputText id="observation" v-model="result.observation" class="w-full" />
        <label for="observation">Observaciones</label>
      </FloatLabel>
    </div>
    <template #footer>
      <Button label="Cancelar" class="min-w-40 btn-clean" @click="cancel" />
      <Button label="Aceptar" class="min-w-40 p-button-success" @click="save" />
    </template>
  </Dialog>
</template>
