<script setup>
// import DonationStatusCard from '@/components/donation/DonationStatusCard.vue';
import InfoDonation from '@/components/donation/InfoDonation.vue';
import { resultSerologyOptions } from '@/enums/SerologyResult';
import InfoDonor from '@/components/donation/InfoDonor.vue';
import { useDonationStore } from '@/stores/donation/donations';
import { useSerologyTestStore } from '@/stores/laboratory/serologyTest';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const donationStore = useDonationStore();
const serologyStore = useSerologyTestStore();
const route = useRoute();
const router = useRouter();
const donation = ref(null);
const donationId = computed(() => route.query.donationId);
const showReactiveWarning = ref(false);
const fieldPendingReset = ref(null);

const isLoading = ref(true);
const serologyResult = ref({
  testDate: null,
  HIV: null,
  HBsAg: null,
  HBcAb: null,
  HCV: null,
  syphilis: null,
  chagas: null,
  htlvI_II: null,
  observations: ''
});

const rules = computed(() => ({
  testDate: { required: required('Fecha de prueba') },
  HIV: { required: required('VIH') },
  HBsAg: { required: required('HBsAg') },
  HBcAb: { required: required('HBcAb') },
  HCV: { required: required('VHC') },
  syphilis: { required: required('Sífilis') },
  chagas: { required: required('Chagas') },
  htlvI_II: { required: required('HtlvI_II') }
}));

const v$ = useVuelidate(rules, serologyResult);

const handleSave = async () => {
  const isValid = await v$.value.$validate();
  if (isValid) {
    let serologyResultNormalized = normalizeEmptyStringsToNull(serologyResult.value);
    const donationRoute = route.query.donationId;
    serologyResultNormalized.donationId = donationRoute;
    await serologyStore.createSerologyTest(serologyResultNormalized);
  } else {
    console.log('Errores en el formulario', v$.value);
  }
};

function normalizeEmptyStringsToNull(obj) {
  const normalized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && value.trim() === '') {
      normalized[key] = null;
    } else {
      normalized[key] = value;
    }
  }
  return normalized;
}

Object.keys(serologyResult.value).forEach((key) => {
  watch(
    () => serologyResult.value[key],
    (newValue) => {
      if (newValue === true) {
        fieldPendingReset.value = key;
        showReactiveWarning.value = true;
      }
    }
  );
});

const confirmReactive = () => {
  showReactiveWarning.value = false;
  fieldPendingReset.value = null;
};

const cancelReactive = () => {
  if (fieldPendingReset.value) {
    serologyResult.value[fieldPendingReset.value] = null;
  }
  showReactiveWarning.value = false;
  fieldPendingReset.value = null;
};
onMounted(async () => {
  const donationResponse = await donationStore.getDonation(donationId.value);
  donation.value = donationResponse;
  isLoading.value = false;
});
</script>

<template>
  <div v-if="isLoading" class="card absolute inset-0 bg-white/50 flex items-center justify-center z-10">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else class="card">
    <div v-if="!donation.canViewDonation">
      <div class="card felx justify-center items-center">
        <p class="text-red-500">Usted no tiene permisos para visualizar esta donación</p>
      </div>
    </div>
    <div v-else>
      <!-- Información de la donación -->
      <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-1 mb-4">
        <div class="md:col-span-3">
          <DonationStatusCard :code-donation="donation.donation.id" :status="donation.donation.status" :deferral-end-date="donation.donor.deferralEndDate" :deferral-reason="donation.donor.deferralReason" />
        </div>
        <div class="md:col-span-1 flex justify-end items-center">
          <Button label="Diferir donante" class="h-8 w-full md:grow md:max-w-[16rem]" severity="danger" />
        </div>
      </div> -->
      <!-- Información de donante -->

      <Fieldset legend="Datos generales del donante" class="!mb-4">
        <div class="rounded-md px-5 pt-5 pb-2 bg-white">
          <InfoDonor :donor="donation?.donor" :isEditable="false" />
        </div>
      </Fieldset>

      <Fieldset legend="Datos generales de la donación" class="!mb-4">
        <div class="rounded-md px-5 pt-5 pb-2 bg-white">
          <InfoDonation :donation="donation?.donation" :isEditable="false" />
        </div>
      </Fieldset>

      <Fieldset legend="Datos de los resultados" class="mb-4">
        <div class="space-y-4">
          <!-- Fecha serología -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <div class="md:col-span-3 font-medium">Fecha serología:</div>
            <div class="md:col-span-9">
              <DatePicker v-model="serologyResult.testDate" dateFormat="dd/mm/yy" showIcon fluid class="w-full md:w-64" :invalid="v$.testDate?.$error" />
              <Message v-if="v$.testDate?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.testDate.$errors[0].$message }}</Message>
            </div>
          </div>

          <!-- VIH -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <div class="md:col-span-3 font-medium">VIH</div>
            <div class="md:col-span-9">
              <Select v-model="serologyResult.HIV" :options="resultSerologyOptions" optionLabel="label" optionValue="value" placeholder="Seleccione resultado" class="w-full md:w-64" :invalid="v$.HIV?.$error">
                <template #value="slotProps">
                  <div :class="slotProps.value === true ? 'text-red-600 font-semibold' : ''">
                    {{ resultSerologyOptions.find((opt) => opt.value === slotProps.value)?.label || slotProps.placeholder }}
                  </div>
                </template>
              </Select>
              <Message v-if="v$.HIV?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.HIV.$errors[0].$message }}</Message>
            </div>
          </div>

          <!-- HBsAg -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <div class="md:col-span-3 font-medium">HBsAg</div>
            <div class="md:col-span-9">
              <Select v-model="serologyResult.HBsAg" :options="resultSerologyOptions" optionLabel="label" optionValue="value" placeholder="Seleccione resultado" class="w-full md:w-64" :invalid="v$.HBsAg?.$error">
                <template #value="slotProps">
                  <div :class="slotProps.value === true ? 'text-red-600 font-semibold' : ''">
                    {{ resultSerologyOptions.find((opt) => opt.value === slotProps.value)?.label || slotProps.placeholder }}
                  </div>
                </template>
              </Select>
              <Message v-if="v$.HBsAg?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.HBsAg.$errors[0].$message }}</Message>
            </div>
          </div>

          <!-- HBcAb -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <div class="md:col-span-3 font-medium">HBcAb</div>
            <div class="md:col-span-9">
              <Select v-model="serologyResult.HBcAb" :options="resultSerologyOptions" optionLabel="label" optionValue="value" placeholder="Seleccione resultado" class="w-full md:w-64" :invalid="v$.HBcAb?.$error">
                <template #value="slotProps">
                  <div :class="slotProps.value === true ? 'text-red-600 font-semibold' : ''">
                    {{ resultSerologyOptions.find((opt) => opt.value === slotProps.value)?.label || slotProps.placeholder }}
                  </div>
                </template>
              </Select>
              <Message v-if="v$.HBcAb?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.HBcAb.$errors[0].$message }}</Message>
            </div>
          </div>

          <!-- VHC -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <div class="md:col-span-3 font-medium">VHC</div>
            <div class="md:col-span-9">
              <Select v-model="serologyResult.HCV" :options="resultSerologyOptions" optionLabel="label" optionValue="value" placeholder="Seleccione resultado" class="w-full md:w-64" :invalid="v$.HCV?.$error">
                <template #value="slotProps">
                  <div :class="slotProps.value === true ? 'text-red-600 font-semibold' : ''">
                    {{ resultSerologyOptions.find((opt) => opt.value === slotProps.value)?.label || slotProps.placeholder }}
                  </div>
                </template>
              </Select>
              <Message v-if="v$.HCV?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.HCV.$errors[0].$message }}</Message>
            </div>
          </div>

          <!-- Sífilis -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <div class="md:col-span-3 font-medium">Sífilis</div>
            <div class="md:col-span-9">
              <Select v-model="serologyResult.syphilis" :options="resultSerologyOptions" optionLabel="label" optionValue="value" placeholder="Seleccione resultado" class="w-full md:w-64" :invalid="v$.syphilis?.$error">
                <template #value="slotProps">
                  <div :class="slotProps.value === true ? 'text-red-600 font-semibold' : ''">
                    {{ resultSerologyOptions.find((opt) => opt.value === slotProps.value)?.label || slotProps.placeholder }}
                  </div>
                </template>
              </Select>
              <Message v-if="v$.syphilis?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.syphilis.$errors[0].$message }}</Message>
            </div>
          </div>

          <!-- Chagas -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <div class="md:col-span-3 font-medium">Chagas</div>
            <div class="md:col-span-9">
              <Select v-model="serologyResult.chagas" :options="resultSerologyOptions" optionLabel="label" optionValue="value" placeholder="Seleccione resultado" class="w-full md:w-64" :invalid="v$.chagas?.$error">
                <template #value="slotProps">
                  <div :class="slotProps.value === true ? 'text-red-600 font-semibold' : ''">
                    {{ resultSerologyOptions.find((opt) => opt.value === slotProps.value)?.label || slotProps.placeholder }}
                  </div>
                </template>
              </Select>
              <Message v-if="v$.chagas?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.chagas.$errors[0].$message }}</Message>
            </div>
          </div>

          <!-- HTLV-I/II -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
            <div class="md:col-span-3 font-medium">HTLV-I/II</div>
            <div class="md:col-span-9">
              <Select v-model="serologyResult.htlvI_II" :options="resultSerologyOptions" optionLabel="label" optionValue="value" placeholder="Seleccione resultado" class="w-full md:w-64" :invalid="v$.htlvI_II?.$error">
                <template #value="slotProps">
                  <div :class="slotProps.value === true ? 'text-red-600 font-semibold' : ''">
                    {{ resultSerologyOptions.find((opt) => opt.value === slotProps.value)?.label || slotProps.placeholder }}
                  </div>
                </template>
              </Select>
              <Message v-if="v$.htlvI_II?.$error" severity="error" size="small" variant="simple" class="mt-2">{{ v$.htlvI_II.$errors[0].$message }}</Message>
            </div>
          </div>

          <!-- Observaciones -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
            <div class="md:col-span-3 font-medium">Observaciones:</div>
            <div class="md:col-span-9">
              <Textarea v-model="serologyResult.observations" rows="5" class="w-full resize-none" />
            </div>
          </div>
        </div>
      </Fieldset>
      <div class="flex justify-end px-8 my-8 gap-4">
        <Button class="h-10 w-full md:max-w-[16rem] btn-clean" label="Cancelar" @click="router.back()" />
        <Button class="h-10 w-full md:max-w-[16rem]" label="Guardar" severity="success" @click="handleSave" />
      </div>
      <Dialog v-model:visible="showReactiveWarning" modal header="Resultado Reactivo" :closable="false" class="w-[90%] md:w-[40rem]">
        <div class="text-gray-700">
          Estas registrando un resultado <strong>REACTIVO</strong>. Esto hará que el donante sea <strong>diferido permanentemente</strong> y se <strong>bloqueará</strong> las unidades donadas para su descarte. <br /><br />
          ¿Estás seguro del resultado?
        </div>
        <template #footer>
          <Button label="No" @click="cancelReactive" />
          <Button label="Sí" class="ml-2 p-button-danger" @click="confirmReactive" />
        </template>
      </Dialog>
    </div>
  </div>
</template>
