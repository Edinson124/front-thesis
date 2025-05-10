<script setup>
import { useTransfusionStore } from '@/stores/transfusion/transfusions';
import { required } from '@/validation/validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const loading = ref(false);
const router = useRouter();
const tranfusionStore = useTransfusionStore();
const errorMessageNotFound = ref(false);
const errorMessageNotCanView = ref(false);

const tranfusion = reactive({
  transfusionCode: ''
});

const rulesCode = computed(() => ({
  transfusionCode: { required: required('Código de tranfusión') }
}));

const v2$ = useVuelidate(rulesCode, tranfusion);

const setFalseMessages = () => {
  errorMessageNotFound.value = false;
  errorMessageNotCanView.value = false;
};

const resetCode = () => {
  tranfusion.transfusionCode = '';
  v2$.value.$reset();
};

const searchTranfusionByCode = async () => {
  const isValid = await v2$.value.$validate();
  if (!isValid) return;

  loading.value = true;
  setFalseMessages();
  const response = await tranfusionStore.verifyTransfusionByCode(tranfusion.transfusionCode);
  if (!response.transfusionActualExists) {
    errorMessageNotFound.value = true;
    loading.value = false;
    return;
  }
  if (!response.canViewTransfusion) {
    errorMessageNotCanView.value = true;
    loading.value = false;
    return;
  }
  router.push({
    path: '/transfusion/register/performed',
    query: { transfusionId: response.transfusionId }
  });
  loading.value = false;
};
watch(
  () => tranfusion.transfusionCode,
  () => {
    setFalseMessages();
  }
);
</script>
<template>
  <div class="card">
    <h3>Registrar resultado de tranfusión</h3>
    <BlockUI :blocked="loading">
      <Fieldset legend="Consultar tranfusión por código">
        <div class="grid grid-cols-1 gap-6 max-w-3xl mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mt-2">
            <div class="text-left md:col-span-3 md:col-start-2 md:text-right">
              <label for="nro_documento" class="text-gray-700">Código de transfusión:</label>
            </div>
            <div class="md:col-span-5">
              <FloatLabel variant="on">
                <InputText id="transfusionCode" v-model="tranfusion.transfusionCode" aria-describedby="transfusionCode" class="w-full" :invalid="v2$.transfusionCode?.$error" />
                <label for="transfusionCode">Código de transfusión</label>
              </FloatLabel>
              <Message v-if="v2$.transfusionCode?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v2$.transfusionCode.$errors[0].$message }}</Message>
            </div>
          </div>
          <!-- Mensaje si no se encuentra la donación -->
          <div v-if="errorMessageNotFound" class="text-red-600 mt-2 text-center">No se encontró ninguna tranfusión con el codigo ingresado.</div>
          <div v-if="errorMessageNotCanView" class="text-red-600 mt-2 text-center">No puedes consultar la tranfusión porque pertenece a otro banco de sangre.</div>
          <div class="flex justify-center gap-4 mt-4">
            <Button class="h-8 w-40 btn-clean" label="Limpiar" @click="resetCode()" />
            <Button class="h-8 w-40" label="Buscar" severity="info" @click="searchTranfusionByCode()" />
          </div>
        </div>

        <!-- Spinner sobre el contenido -->
        <div v-if="loading" class="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <ProgressSpinner style="width: 50px; height: 50px" />
        </div>
      </Fieldset>
    </BlockUI>
  </div>
</template>
