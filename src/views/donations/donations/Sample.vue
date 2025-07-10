<script setup>
import UnitTable from '@/components/unit/UnitTable.vue';
import { testOptions } from '@/enums/Sample';
import { useDonationStore } from '@/stores/donation/donations';
import { useSampleUnitsStore } from '@/stores/donation/units';
import { required } from '@/validation/validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const donationId = computed(() => route.query.donationId);

const donationStore = useDonationStore();
const sampleUnitsStore = useSampleUnitsStore();
const selectedSample1 = ref(null);
const selectedSample2 = ref(null);
const codeSample1 = ref(null);
const codeSample2 = ref(null);
const editDonation = ref(null);

const state1 = { selectedSample1 };
const state2 = { selectedSample2 };

const rulesSample1 = computed(() => ({
  selectedSample1: { required: required('Prueba') }
}));

const v1$ = useVuelidate(rulesSample1, state1);

const rulesSample2 = computed(() => ({
  selectedSample2: { required: required('Prueba') }
}));

const v2$ = useVuelidate(rulesSample2, state2);

const saveSample = async (number) => {
  if (number == 1) {
    const isValid = await v1$.value.$validate();
    if (!isValid) return;
    const response = await sampleUnitsStore.saveSample(donationId.value, selectedSample1.value);
    codeSample1.value = response;
  } else {
    const isValid = await v2$.value.$validate();
    if (!isValid) return;
    const response = await sampleUnitsStore.saveSample(donationId.value, selectedSample2.value);
    codeSample2.value = response;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const donationResponse = await donationStore.getDonation(donationId.value);
    editDonation.value = donationResponse.donation.status === 'En proceso';
    await Promise.all([sampleUnitsStore.fetchUnits(donationId.value), sampleUnitsStore.fetchUnitTypesCreate(), sampleUnitsStore.fetchUnitBags(), sampleUnitsStore.fetchUnitAnticoagunlants()]);
    const samples = await sampleUnitsStore.getSamples(donationId.value);
    if (samples && samples.length > 0) {
      // Si hay muestras, asignarlas a selectedSample1 y selectedSample2
      if (samples.length >= 1) {
        selectedSample1.value = samples[0].test; // O usa el id correspondiente
        codeSample1.value = samples[0].id;
      }

      if (samples.length === 2) {
        selectedSample2.value = samples[1].test; // O usa el id correspondiente
        codeSample2.value = samples[1].id;
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const saveUnit = async (unit) => {
  await sampleUnitsStore.saveUnit(donationId.value, unit);
  await sampleUnitsStore.fetchUnits(donationId.value);
};

const editUnit = async (index, unit) => {
  await sampleUnitsStore.editTableUnit(unit.id, unit);
  await sampleUnitsStore.fetchUnits(donationId.value);
};

watch(selectedSample1, (newVal) => {
  if (newVal === 'Prueba serológica') {
    selectedSample2.value = 'Prueba hematológica';
  } else if (newVal === 'Prueba hematológica') {
    selectedSample2.value = 'Prueba serológica';
  } else {
    selectedSample2.value = null;
  }
});

watch(selectedSample2, (newVal) => {
  if (newVal === 'Prueba serológica') {
    selectedSample1.value = 'Prueba hematológica';
  } else if (newVal === 'Prueba hematológica') {
    selectedSample1.value = 'Prueba serológica';
  } else {
    selectedSample1.value = null;
  }
});
</script>

<template>
  <div v-if="loading" class="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else class="card">
    <div class="mb-4 flex flex-wrap justify-between items-center gap-2">
      <h3 class="min-w-[10rem] !mt-2">Muestras y unidades</h3>
      <Button class="h-8 w-full md:grow max-w-[16rem] md:max-w-[16rem]" label="Diferir donante" severity="danger" @click="() => {}" />
    </div>

    <Panel header="Muestra 1" class="my-8">
      <div class="flex flex-row w-full items-center">
        <div class="w-full md:w-1/2 flex flex-col gap-4">
          <FloatLabel variant="on" class="mr-8">
            <InputText id="code-sample-1" v-model="codeSample1" class="w-full" disabled />
            <label for="code-sample-1">Código</label>
          </FloatLabel>
          <FloatLabel variant="on" class="mr-8">
            <Select id="sample-1" v-model="selectedSample1" :options="testOptions" optionLabel="label" optionValue="value" class="w-full" :disabled="codeSample1 != null" :invalid="v1$.selectedSample1?.$error" />
            <label for="sample-1">Prueba</label>
          </FloatLabel>
          <Message v-if="v1$.selectedSample1?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v1$.selectedSample1.$errors[0].$message }}</Message>
        </div>
        <!-- <div class="w-full md:w-auto md:grow"><Button label="Obtener etiqueta" class="min-w-40 p-button-success" /></div> -->
      </div>
      <div v-if="codeSample1 == null" class="flex justify-end mt-2">
        <div class="w-full md:w-auto"><Button label="Guardar" class="min-w-40 p-button-success" @click="saveSample(1)" /></div>
      </div>
    </Panel>
    <Panel header="Muestra 2" class="my-8">
      <div class="flex flex-row w-full items-center">
        <div class="w-full md:w-1/2 flex flex-col gap-4">
          <FloatLabel variant="on" class="mr-8">
            <InputText id="code-sample-2" v-model="codeSample2" class="w-full" disabled />
            <label for="code-sample-2">Código</label>
          </FloatLabel>
          <FloatLabel variant="on" class="mr-8">
            <Select id="sample-2" v-model="selectedSample2" disabled :options="testOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v2$.selectedSample2?.$error" />
            <label for="sample-2">Prueba</label>
          </FloatLabel>
          <Message v-if="v2$.selectedSample2?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v2$.selectedSample2.$errors[0].$message }}</Message>
        </div>
        <!-- <div class="w-full md:w-auto md:grow"><Button label="Obtener etiqueta" class="min-w-40 p-button-success" /></div> -->
      </div>
      <div v-if="codeSample2 == null" class="flex justify-end mt-2">
        <div class="w-full md:w-auto"><Button label="Guardar" class="min-w-40 p-button-success" @click="saveSample(2)" /></div>
      </div>
    </Panel>

    <UnitTable v-model="sampleUnitsStore.units" :read-only="!editDonation" :loading="loading" :totalUnits="sampleUnitsStore.totalUnits" @edit="editUnit" @add="saveUnit" />

    <div class="flex justify-end px-8 my-8 gap-4">
      <Button class="w-full md:max-w-[16rem] btn-clean" label="Regresar" @click="router.back()" />
    </div>
  </div>
</template>
