<script setup>
import { reactive } from 'vue';

const result = reactive({ type: '', observation: '' });

const showModal = defineModel({ type: Boolean, required: true });
const emit = defineEmits(['save']);

const close = () => {
  showModal.value = false;
};

const save = () => {
  emit('save', result);
  close();
};
</script>

<template>
  <Dialog v-model:visible="showModal" header="Registrar resultado prueba cruzada" modal class="w-[30rem] p-2">
    <div>
      <FloatLabel variant="on" class="mt-4 w-1/2">
        <InputText id="resultType" v-model="result.type" class="w-full" />
        <label for="resultType">Resultado</label>
      </FloatLabel>

      <FloatLabel variant="on" class="mt-4 w-full">
        <InputText id="observation" v-model="result.observation" class="w-full" />
        <label for="observation">Observaciones</label>
      </FloatLabel>
    </div>
    <template #footer>
      <Button label="Cancelar" class="min-w-40 btn-clean" @click="() => (showModal = false)" />
      <Button label="Aceptar" class="min-w-40 p-button-success" @click="save" />
    </template>
  </Dialog>
</template>
