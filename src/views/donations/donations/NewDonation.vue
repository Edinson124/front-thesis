<script setup>
import DonationForm from '@/components/donation/DonationForm.vue';
import DonorStatusCard from '@/components/donation/DonorStatusCard.vue';
import InfoDonor from '@/components/donation/InfoDonor.vue';
import { useDonorStore } from '@/stores/donation/donor';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const donorStore = useDonorStore();
const route = useRoute();
const router = useRouter();

const lastDonationDateDetail = ref(null);

const donor = reactive({
  documentType: '',
  documentNumber: '',
  firstName: '',
  lastName: '',
  secondLastName: '',
  birthDate: null,
  gender: '',
  email: '',
  phone: '',
  region: null,
  province: null,
  district: null,
  address: '',
  occupation: '',
  placeOfBirth: '',
  placeOfOrigin: '',
  maritalStatus: '',
  deferralEndDate: null,
  deferralReason: '',
  status: '',
  trips: ''
});

onMounted(async () => {
  const documentNumber = route.params.doc;
  const documentType = route.params.type;

  const donorResponse = await donorStore.getDonor(documentNumber, documentType);
  Object.assign(donor, { ...donor, ...donorResponse });
});
</script>
<template>
  <div class="card">
    <div class="mb-4">
      <h3>Registrar Donación</h3>
    </div>
    <DonorStatusCard
      :document-number="donor.documentNumber"
      :status="donor.status"
      :deferral-end-date="donor.deferralEndDate"
      :deferral-reason="donor.deferralReason"
      :gender="donor.gender"
      :last-donation-date="lastDonationDateDetail?.dateDonation || null"
      :date-enabled="lastDonationDateDetail?.dateEnabledDonation || null"
    />

    <!-- Datos generales del donante -->
    <Fieldset legend="Datos generales del donante" class="!mb-4">
      <div class="rounded-md px-5 pt-5 pb-2 bg-white">
        <InfoDonor :donor="donor" :isEditable="true" />
      </div>
    </Fieldset>

    <DonationForm :donor="donor" @success="() => router.push('/donation/search/donor')" @cancel="() => router.push('/donation/search/donor')" />
  </div>
</template>
