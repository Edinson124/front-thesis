<script setup>
import { extractionStatusOptions } from '@/enums/Status';
import router from '@/router';
import { useExtractionStore } from '@/stores/donation/extraction';
import { required, requiredIf } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const extractionStore = useExtractionStore();
const route = useRoute();

const extraction = ref({
  startDate: null,
  startTime: null,
  endDateTime: null,
  durationMinutes: '',
  processedBloodVolumeMl: '',
  arm: null,
  adverseReactionOccurred: null,
  adverseReaction: null,
  otherReaction: '',
  status: null,
  observation: ''
});

// Reglas de validación
const rules = computed(() => ({
  extraction: {
    startDate: { required: required('Fecha de Inicio') },
    startTime: { required: required('Hora de Inicio') },
    durationMinutes: { required: required('Duración') },
    processedBloodVolumeMl: { required: required('Volumen total procesado') },
    arm: { required: required('Brazo de extracción') },
    adverseReactionOccurred: { required: required('¿Se presentó reacciones adversas?') },
    adverseReaction: {
      required: requiredIf('Reacciones adversas', () => extraction.value.adverseReactionOccurred === 'Si')
    },
    otherReaction: {},
    status: { required: required('Estado de extracción') },
    observation: {}
  }
}));

const v$ = useVuelidate(rules, { extraction });

const calculateEndTime = computed(() => {
  if (extraction.value.startDate && extraction.value.startTime && extraction.value.durationMinutes > 0) {
    const startDateTime = new Date(extraction.value.startDate);
    const startTime = new Date(extraction.value.startTime);
    // Establece las horas y minutos de startDateTime usando startTime
    startDateTime.setHours(startTime.getHours());
    startDateTime.setMinutes(startTime.getMinutes());
    // Suma la duración en minutos
    startDateTime.setMinutes(startDateTime.getMinutes() + parseInt(extraction.value.durationMinutes));
    return startDateTime;
  }
  return null;
});

watch([() => extraction.value.startDate, () => extraction.value.startTime, () => extraction.value.durationMinutes], () => {
  extraction.value.endDateTime = calculateEndTime.value;
});

const handleSave = async () => {
  const isValid = await v$.value.$validate();
  if (isValid) {
    const extractionData = JSON.parse(JSON.stringify(extraction.value));
    const donationRoute = route.query.donationId;
    extractionData.donationId = donationRoute;
    await extractionStore.createExtraction(extractionData);
    console.log('Datos a guardar:', extraction.value);
  } else {
    console.log('Errores en el formulario', v$.value);
  }
};
</script>

<template>
  <div class="card">
    <h3 class="min-w-[10rem] !mt-2">Extracción de la donación</h3>
    <!-- <div class="mb-4 flex justify-end">
      <Button class="h-8 w-full md:grow md:max-w-[16rem]" label="Diferir donante" severity="danger" @click="() => {}" />
    </div> -->

    <Fieldset legend="Datos de la extracción">
      <div class="flex items-center justify-between gap-4 px-8 mt-6 mb-2">
        <span class="w-full md:w-1/4">
          <FloatLabel variant="on" class="w-full">
            <DatePicker v-model="extraction.startDate" class="w-full" showIcon fluid />
            <label for="startDate">Fecha de Inicio</label>
          </FloatLabel>
          <Message v-if="v$.extraction.startDate?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.extraction.startDate.$errors[0].$message }}</Message>
        </span>

        <span class="w-full md:w-1/4">
          <FloatLabel variant="on" class="w-full">
            <DatePicker v-model="extraction.startTime" class="w-full" showIcon fluid iconDisplay="input" timeOnly>
              <template #inputicon="slotProps">
                <i class="pi pi-clock" @click="slotProps.clickCallback" />
              </template>
            </DatePicker>
            <label for="startTime">Hora de Inicio</label>
          </FloatLabel>
          <Message v-if="v$.extraction.startTime?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.startTime.$errors[0].$message }}
          </Message>
        </span>

        <FloatLabel variant="on" class="w-full md:w-1/4">
          <DatePicker id="endDateTime" v-model="extraction.endDateTime" disabled class="w-full" showIcon fluid showTime hourFormat="24" />
          <label for="endDateTime">Fecha y Hora Final</label>
        </FloatLabel>
      </div>

      <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <span class="w-full">
          <div class="w-full flex items-center gap-4">
            <FloatLabel variant="on" class="w-full md:w-1/4">
              <InputText v-model="extraction.durationMinutes" class="w-full" id="durationMinutes" />
              <label for="durationMinutes">Duración</label>
            </FloatLabel>
            <span>min</span>
          </div>
          <Message v-if="v$.extraction.durationMinutes?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.durationMinutes.$errors[0].$message }}
          </Message>
        </span>
      </div>

      <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <span class="w-full">
          <div class="w-full flex items-center gap-4">
            <FloatLabel variant="on" class="w-full md:w-1/4">
              <InputText v-model="extraction.processedBloodVolumeMl" class="w-full" id="processedBloodVolumeMl" />
              <label for="processedBloodVolumeMl">Volumen total procesado</label>
            </FloatLabel>
            <span>ml</span>
          </div>
          <Message v-if="v$.extraction.processedBloodVolumeMl?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.processedBloodVolumeMl.$errors[0].$message }}
          </Message>
        </span>
      </div>

      <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <span class="w-full md:w-1/4">
          <FloatLabel variant="on" class="w-full">
            <Select
              v-model="extraction.arm"
              class="w-full"
              :options="[
                { label: 'Izquierdo', value: 'Izquierdo' },
                { label: 'Derecho', value: 'Derecho' }
              ]"
              optionLabel="label"
              optionValue="value"
              showClear
            />
            <label>Brazo de extracción</label>
          </FloatLabel>
          <Message v-if="v$.extraction.arm?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.arm.$errors[0].$message }}
          </Message>
        </span>
      </div>

      <div class="flex flex-col gap-2 px-8 mt-6 mb-2">
        <div class="flex items-center gap-8">
          <h6 class="m-0">¿Se presentó reacciones adversas?</h6>
          <div
            class="flex items-center gap-2"
            v-for="(option, index) in [
              { label: 'Si', value: true },
              { label: 'No', value: false }
            ]"
            :key="index"
          >
            <RadioButton :inputId="`reaction-${index}`" :value="option.value" v-model="extraction.adverseReactionOccurred" name="adverseReactionOccurred" />
            <label :for="`reaction-${index}`">{{ option.label }}</label>
          </div>
        </div>
        <Message v-if="v$.extraction.adverseReactionOccurred?.$error" severity="error" size="small" variant="simple" class="mt-2">
          {{ v$.extraction.adverseReactionOccurred.$errors[0].$message }}
        </Message>
      </div>

      <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <span class="w-full md:w-1/4">
          <FloatLabel variant="on" class="w-full">
            <Select
              v-model="extraction.adverseReaction"
              class="w-full"
              :options="[
                { label: 'Mareos', value: 'dizziness' },
                { label: 'Náuseas', value: 'nausea' }
              ]"
              optionLabel="label"
              optionValue="value"
              showClear
            />
            <label>Reacciones adversas</label>
          </FloatLabel>
          <Message v-if="v$.extraction.adverseReaction?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.adverseReaction.$errors[0].$message }}
          </Message>
        </span>
      </div>

      <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <FloatLabel variant="on" class="w-full md:w-1/4">
          <InputText v-model="extraction.otherReaction" class="w-full" id="other-reaction" />
          <label for="other-reaction">Otra reacción</label>
        </FloatLabel>
      </div>

      <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <span class="w-full md:w-1/4">
          <FloatLabel variant="on" class="w-full">
            <Select v-model="extraction.status" class="w-full" :options="extractionStatusOptions" optionLabel="label" optionValue="value" showClear />
            <label>Estado de extracción</label>
          </FloatLabel>
          <Message v-if="v$.extraction.status?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.status.$errors[0].$message }}
          </Message>
        </span>
      </div>

      <div class="flex flex-col items-start gap-4 px-8 mt-10 mb-6">
        <FloatLabel variant="on" class="w-full">
          <Textarea id="observation" v-model="extraction.observation" class="w-full md:grow resize-none" rows="5" />
          <label for="observation">Observaciones</label>
        </FloatLabel>
      </div>
    </Fieldset>

    <div class="flex justify-end px-8 my-8 gap-4">
      <Button class="h-10 w-full md:max-w-[16rem] btn-clean" label="Cancelar" @click="router.back()" />
      <Button class="h-10 w-full md:max-w-[16rem]" label="Guardar" severity="success" @click="handleSave" />
    </div>
  </div>
</template>
