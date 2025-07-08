<script setup>
import { resultSerology } from '@/enums/SerologyResult';
import { computed } from 'vue';
const props = defineProps({
  serologyTest: Object,
  bloodType: String,
  showBloodType: Boolean,
  hematologicTest: Object
});
const bloodLetter = computed(() => props.bloodType?.slice(0, -1)); // O, A, B, AB
const rhSign = computed(() => props.bloodType?.slice(-1)); // + o -
const rhText = computed(() => {
  return rhSign.value === '+' ? 'POSITIVO' : rhSign.value === '-' ? 'NEGATIVO' : '';
});
</script>
<template>
  <Fieldset legend="Datos de los resultados" class="mb-2">
    <div class="rounded-md px-5 pt-5 pb-2 bg-white">
      <div v-if="serologyTest === null" class="py-4 text-center">
        <i class="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
        <p class="text-gray-700 font-medium">Resultados pendientes de pruebas</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Columna izquierda -->
        <div class="space-y-2">
          <div class="flex">
            <div class="mr-2">Fecha serología:</div>
            <div>{{ serologyTest.testDate }}</div>
          </div>

          <div class="flex">
            <div class="font-medium w-28">VIH:</div>
            <div class="text-center mb-2" :class="serologyTest.hiv ? 'text-red-600 font-bold' : 'text-black'">
              {{ serologyTest.hiv ? resultSerology.TRUE : resultSerology.FALSE }}
            </div>
          </div>

          <div class="flex">
            <div class="font-medium w-28">HBsAg:</div>
            <div class="text-center mb-2" :class="serologyTest.hbsAg ? 'text-red-600 font-bold' : 'text-black'">
              {{ serologyTest.hbsAg ? resultSerology.TRUE : resultSerology.FALSE }}
            </div>
          </div>

          <div class="flex">
            <div class="font-medium w-28">HBcAb:</div>
            <div class="text-center mb-2" :class="serologyTest.hbcAb ? 'text-red-600 font-bold' : 'text-black'">
              {{ serologyTest.hbcAb ? resultSerology.TRUE : resultSerology.FALSE }}
            </div>
          </div>

          <div class="flex">
            <div class="font-medium w-28">VHC:</div>
            <div class="text-center mb-2" :class="serologyTest.hcv ? 'text-red-600 font-bold' : 'text-black'">
              {{ serologyTest.hcv ? resultSerology.TRUE : resultSerology.FALSE }}
            </div>
          </div>

          <div class="flex">
            <div class="font-medium w-28">Sífilis:</div>
            <div class="text-center mb-2" :class="serologyTest.syphilis ? 'text-red-600 font-bold' : 'text-black'">
              {{ serologyTest.syphilis ? resultSerology.TRUE : resultSerology.FALSE }}
            </div>
          </div>

          <div class="flex">
            <div class="font-medium w-28">Chagas:</div>
            <div class="text-center mb-2" :class="serologyTest.chagas ? 'text-red-600 font-bold' : 'text-black'">
              {{ serologyTest.chagas ? resultSerology.TRUE : resultSerology.FALSE }}
            </div>
          </div>

          <div class="flex">
            <div class="font-medium w-28">HTLV-I/II:</div>
            <div class="text-center mb-2" :class="serologyTest.htlvI_II ? 'text-red-600 font-bold' : 'text-black'">
              {{ serologyTest.htlvI_II ? resultSerology.TRUE : resultSerology.FALSE }}
            </div>
          </div>

          <div class="flex">
            <div class="font-medium w-28">Observaciones:</div>
            <div>{{ serologyTest.observations || '-' }}</div>
          </div>
        </div>

        <!-- Columna derecha -->
        <div v-if="showBloodType" class="flex flex-col">
          <div class="text-xl mb-2 font-medium">Grupo sanguíneo</div>
          <div class="text-4xl font-bold">{{ bloodLetter }}</div>
          <div class="text-xl font-semibold">Rh {{ rhText }}</div>
          <div class="mt-1 text-l">Genotipo: {{ hematologicTest?.genotype || '-' }}</div>
          <div class="text-l">Fenotipo: {{ hematologicTest?.phenotype || '-' }}</div>
          <div class="text-l">Anitcuerpos irregulares {{ hematologicTest?.irregularAntibodies || '-' }}</div>
        </div>
      </div>
    </div>
  </Fieldset>
</template>
