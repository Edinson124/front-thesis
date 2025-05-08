<script setup>
// import DonationStatusCard from '@/components/donation/DonationStatusCard.vue';
import InfoDonation from '@/components/donation/InfoDonation.vue';
import UnitInfoCard from '@/components/unit/UnitInfoCard.vue';
import UnitTable from '@/components/unit/UnitTable.vue';
import { useDonationStore } from '@/stores/donation/donations';
import { useUnitsTranformationStore } from '@/stores/laboratory/unitsTranformation';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const donationStore = useDonationStore();
const unitsTransformationStore = useUnitsTranformationStore();
const route = useRoute();
const router = useRouter();

const donation = ref(null);
const unit = ref(null);
const donationId = computed(() => route.query.donationId);
const unitId = computed(() => route.query.unitId);

const isLoading = ref(true);

const handleSave = async () => {
  console.log('guardando');
};

onMounted(async () => {
  // const donationResponse = await donationStore.getDonation(donationId.value);
  // const unitReponse = await unitsTransformationStore.getUnitById(unitId.value);
  // await unitsTransformationStore.getUnitsFromUnit(unitId.value);
  // donation.value = donationResponse;
  // unit.value = unitReponse;

  try {
    isLoading.value = true;
    const [donationResponse, unitResponse] = await Promise.all([donationStore.getDonation(donationId.value), unitsTransformationStore.getUnitById(unitId.value), unitsTransformationStore.getUnitsFromUnit(unitId.value)]);

    donation.value = donationResponse;
    unit.value = unitResponse;
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
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
      <h2>Fraccionar Unidad</h2>
      <Fieldset legend="Datos de la unidad" class="!mb-4">
        <div class="rounded-md px-5 pt-5 pb-2 bg-white">
          <InfoDonation :donation="donation?.donation" :isEditable="false" />
        </div>
      </Fieldset>

      <UnitInfoCard :unit="unit" />

      <UnitTable
        title="Unidades hematológicas resultantes"
        v-model="unitsTransformationStore.unitsFromUnit"
        typeModal="transformation"
        :loading="isLoading"
        :totalUnits="unitsTransformationStore.totalUnitsFromUnit"
        @edit="(index, unit) => unitsTransformationStore.editUnitFromUnit(index, unit)"
        @add="(unit) => unitsTransformationStore.addUnitFromUnit(unit)"
      />
    </div>
  </div>
</template>
