<script setup>
// import DonationStatusCard from '@/components/donation/DonationStatusCard.vue';
import InfoDonation from '@/components/donation/InfoDonation.vue';
import UnitInfoCard from '@/components/unit/UnitInfoCard.vue';
import UnitTable from '@/components/unit/UnitTable.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { useDonationStore } from '@/stores/donation/donations';
import { useUnitsTranformationStore } from '@/stores/laboratory/unitsTranformation';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const donationStore = useDonationStore();
const unitsTransformationStore = useUnitsTranformationStore();
const route = useRoute();

const donation = ref(null);
const unit = ref(null);
const donationId = computed(() => route.query.donationId);
const unitId = computed(() => route.query.unitId);
// const unitStamp = ref(null);

const showSuccessModal = ref(false);
const showErrorModal = ref(false);

// const showStampModal = ref(false);
// const showSuccessStampModal = ref(false);
// const showErrorStampModal = ref(false);
// const verifyStampModal = ref(false);

const isLoading = ref(true);

const closeSuccesModal = () => {
  showSuccessModal.value = false;
};
// const closeSuccesStampModal = () => {
//   showSuccessStampModal.value = false;
// };

// const saveStampUnit = async (stamp) => {
//   const response = await unitsTransformationStore.saveStampUnit(unitStamp.value.id, stamp);
//   if (!response) {
//     showErrorStampModal.value = true;
//     return;
//   }
//   if (response.register === false) {
//     verifyStampModal.value = true;
//     return;
//   } else {
//     showSuccessStampModal.value = true;
//     await unitsTransformationStore.getUnitsFromUnit(unitId.value);
//   }
// };

const saveUnit = async (unitSaved) => {
  const response = await unitsTransformationStore.saveUnit(unitId.value, unitSaved);
  if (response) {
    showSuccessModal.value = true;
    await unitsTransformationStore.getUnitsFromUnit(unitId.value);
  } else {
    showErrorModal.value = true;
  }
};

const editUnit = async (index, unit) => {
  const response = await unitsTransformationStore.editTableUnit(unit.id, unit);
  if (response) {
    showSuccessModal.value = true;
    await unitsTransformationStore.getUnitsFromUnit(unitId.value);
  } else {
    showErrorModal.value = true;
  }
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
      <Fieldset legend="Datos de la donación" class="!mb-4">
        <div class="rounded-md px-5 pt-5 pb-2 bg-white">
          <InfoDonation :donation="donation?.donation" :isEditable="false" />
        </div>
      </Fieldset>

      <UnitInfoCard :unit="unit" />

      <UnitTable
        title="Unidades hematológicas resultantes"
        v-model="unitsTransformationStore.unitsFromUnit"
        type="allDataTransformation"
        typeModal="transformation"
        :loading="isLoading"
        :totalUnits="unitsTransformationStore.totalUnitsFromUnit"
        :typeUnit="unit.unitType"
        @edit="editUnit"
        @add="saveUnit"
      />
      <SuccessModal id="succesSaveUnitTransformation" v-model="showSuccessModal" message="La unidad se ha guardado con éxito" @close="closeSuccesModal" />
      <ErrorModal id="errorSaveUnitTransformation" v-model="showErrorModal" />

      <!-- <UnitStampModal v-model="showStampModal" header="Registrar sello" headerConfirm="Registrar sello" message="¿Está seguro de registrar el sello a la unidad?" @save="saveStampUnit" /> -->
      <!-- <SuccessModal id="succesStampUnit" v-model="showSuccessStampModal" message="Se ha registrado el sello de pronahebas con éxito, la unidad esta disponible en stock" @close="closeSuccesStampModal" /> -->
      <!-- <ErrorModal id="errorStampUnit" v-model="showErrorStampModal" /> -->

      <!-- <ErrorModal
        id="errorVerifyUnitTransformation"
        v-model="verifyStampModal"
        header="Verificación sello pronahebas"
        message="El código del sello de Pronahebas ingresado no está disponible, esta asignado a otra unidad, intentelo con otro código"
        more-message=""
      /> -->
    </div>
  </div>
</template>
