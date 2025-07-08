<script setup>
import { computed } from 'vue';
const props = defineProps({
  unit: Object
});
const bloodLetter = computed(() => props.unit.bloodType?.slice(0, -1)); // O, A, B, AB
const rhSign = computed(() => props.unit.bloodType?.slice(-1)); // + o -
const rhText = computed(() => {
  return rhSign.value === '+' ? 'POSITIVO' : rhSign.value === '-' ? 'NEGATIVO' : '';
});
</script>
<template>
  <Fieldset legend="Datos de la unidad" class="mb-4">
    <div class="rounded-md px-5 pt-5 pb-2 bg-white">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <!-- Columna izquierda -->
        <div class="space-y-2">
          <div class="flex">
            <div class="mr-2">Código de la unidad:</div>
            <div>{{ unit.id }}</div>
          </div>

          <div class="flex">
            <div class="mr-2">Sello de Pronahebas:</div>
            <div>{{ unit.stampPronahebas }}</div>
          </div>

          <div class="flex">
            <div class="font-medium">Tipo de unidad:</div>
            <div class="text-center ml-2">{{ unit.unitType }}</div>
          </div>

          <div class="flex">
            <div class="font-medium">Volumen:</div>
            <div class="text-center ml-2">{{ unit.volume }} ml</div>
          </div>

          <div class="flex">
            <div class="font-medium">Anticoagulante:</div>
            <div class="text-center ml-2">{{ unit.anticoagulant }}</div>
          </div>

          <div class="flex">
            <div class="font-medium">Tipo bolsa:</div>
            <div class="text-center ml-2">{{ unit.bagType }}</div>
          </div>
        </div>

        <!-- Columna derecha -->
        <div class="flex flex-col">
          <div class="text-xl mb-2 font-medium">Grupo sanguíneo</div>
          <div class="text-4xl font-bold">{{ bloodLetter }}</div>
          <div class="text-xl font-semibold">Rh {{ rhText }}</div>
          <div class="mt-1 text-l">Genotipo: {{ unit.genotype }}</div>
          <div class="text-l">Fenotipo: {{ unit.phenotype }}</div>
          <div class="text-l">Anitcuerpos irregulares {{ unit.irregularAntibodies }}</div>
        </div>
      </div>
    </div>
  </Fieldset>
</template>
