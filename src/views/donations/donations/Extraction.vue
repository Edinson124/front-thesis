<script setup>
import router from '@/router';
import { required, requiredIf } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, ref } from 'vue';

const extraction = ref({
  startDate: null,
  startTime: null,
  duration: '',
  volume: '',
  arm: null,
  hadAdverseReactions: null,
  adverseReaction: null,
  otherReaction: '',
  extractionStatus: null,
  observations: ''
});

// Reglas de validación
const rules = computed(() => ({
  extraction: {
    startDate: { required: required('Fecha de Inicio') },
    startTime: { required: required('Hora de Inicio') },
    duration: { required: required('Duración') },
    volume: { required: required('Volumen total procesado') },
    arm: { required: required('Brazo de extracción') },
    hadAdverseReactions: { required: required('¿Se presentó reacciones adversas?') },
    adverseReaction: {
      required: requiredIf('Reacciones adversas', () => extraction.value.hadAdverseReactions === 'Si')
    },
    otherReaction: {},
    extractionStatus: { required: required('Estado de extracción') },
    observations: {}
  }
}));

const v$ = useVuelidate(rules, { extraction });

const handleSave = async () => {
  const isValid = await v$.value.$validate();
  if (isValid) {
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
            <DatePicker v-model="extraction.startTime" class="w-full" showIcon fluid timeOnly>
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
          <DatePicker disabled class="w-full" showIcon fluid />
          <label for="endDate">Fecha y Hora Final</label>
        </FloatLabel>
      </div>

      <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <span class="w-full">
          <div class="w-full flex items-center gap-4">
            <FloatLabel variant="on" class="w-full md:w-1/4">
              <InputText v-model="extraction.duration" class="w-full" id="duration" />
              <label for="duration">Duración</label>
            </FloatLabel>
            <span>min</span>
          </div>
          <Message v-if="v$.extraction.duration?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.duration.$errors[0].$message }}
          </Message>
        </span>
      </div>

      <div class="flex items-center gap-4 px-8 mt-6 mb-2">
        <span class="w-full">
          <div class="w-full flex items-center gap-4">
            <FloatLabel variant="on" class="w-full md:w-1/4">
              <InputText v-model="extraction.volume" class="w-full" id="volume" />
              <label for="volume">Volumen total procesado</label>
            </FloatLabel>
            <span>ml</span>
          </div>
          <Message v-if="v$.extraction.volume?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.volume.$errors[0].$message }}
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
                { label: 'Izquierdo', value: 'left' },
                { label: 'Derecho', value: 'right' }
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
          <div class="flex items-center gap-2" v-for="(option, index) in ['Si', 'No']" :key="index">
            <RadioButton :inputId="`reaction-${index}`" :value="option" v-model="extraction.hadAdverseReactions" name="hadAdverseReactions" />
            <label :for="`reaction-${index}`">{{ option }}</label>
          </div>
        </div>
        <Message v-if="v$.extraction.hadAdverseReactions?.$error" severity="error" size="small" variant="simple" class="mt-2">
          {{ v$.extraction.hadAdverseReactions.$errors[0].$message }}
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
            <Select
              v-model="extraction.extractionStatus"
              class="w-full"
              :options="[
                { label: 'Completada', value: 'completed' },
                { label: 'Cancelada', value: 'cancelled' }
              ]"
              optionLabel="label"
              optionValue="value"
              showClear
            />
            <label>Estado de extracción</label>
          </FloatLabel>
          <Message v-if="v$.extraction.extractionStatus?.$error" severity="error" size="small" variant="simple" class="mt-2">
            {{ v$.extraction.extractionStatus.$errors[0].$message }}
          </Message>
        </span>
      </div>

      <div class="flex flex-col items-start gap-4 px-8 mt-10 mb-6">
        <span class="w-full md:max-w-[50%]">Observaciones</span>
        <Textarea v-model="extraction.observations" class="w-full md:grow resize-none" rows="5" />
      </div>
    </Fieldset>

    <div class="flex justify-end px-8 my-8 gap-4">
      <Button class="h-10 w-full md:max-w-[16rem] btn-clean" label="Cancelar" @click="router.back()" />
      <Button class="h-10 w-full md:max-w-[16rem]" label="Guardar" severity="success" @click="handleSave" />
    </div>
  </div>
</template>
