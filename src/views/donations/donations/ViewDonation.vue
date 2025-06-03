<script setup>
import DeferralModal from '@/components/donation/DeferralModal.vue';
import DonationStatusCard from '@/components/donation/DonationStatusCard.vue';
import InfoDonation from '@/components/donation/InfoDonation.vue';
import InfoDonor from '@/components/donation/InfoDonor.vue';
import { deferralOptionsGrouped } from '@/enums/DeferralType';
import { useDonationStore } from '@/stores/donation/donations';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const donationStore = useDonationStore();
const route = useRoute();
const router = useRouter();
const donation = ref(null);
const editDonation = ref(null);
const donationId = computed(() => route.query.donationId);
const showModalDeferralDonor = ref(false);

const isLoading = ref(true);

const redirectInterview = () => {
  router.push({
    path: '/donation/interview',
    query: { donationId: donationId.value }
  });
};

const redirectExtraction = () => {
  router.push({
    path: '/donation/extraction',
    query: { donationId: donationId.value }
  });
};

const redirectExam = () => {
  router.push({
    path: '/donation/physical',
    query: { donationId: donationId.value }
  });
};

const redirectSamples = () => {
  router.push({
    path: '/donation/sample',
    query: { donationId: donationId.value }
  });
};

const deferralDonor = async (deferral) => {
  const response = await donationStore.deferralDonor(donationId.value, deferral);
  console.log(response);
  if (response) {
    router.push({ path: 'view', query: { donationId: donationId.value } });
  }
};

const openDeferralDonorModal = () => {
  showModalDeferralDonor.value = true;
};

onMounted(async () => {
  const donationResponse = await donationStore.getDonation(donationId.value);
  donation.value = donationResponse;
  editDonation.value = donationResponse.donation.status === 'En proceso';
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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-1 mb-4">
        <div class="md:col-span-3">
          <DonationStatusCard :code-donation="donation.donation.id" :status="donation.donation.status" :deferral-end-date="donation.donor.deferralEndDate" :deferral-reason="donation.donor.deferralReason" />
        </div>
        <div class="md:col-span-1 flex justify-end items-center">
          <Button v-if="editDonation" label="Diferir donante" class="h-8 w-full md:grow md:max-w-[16rem]" severity="danger" @click="openDeferralDonorModal" />
        </div>
      </div>
      <!-- Información de donante -->

      <Fieldset legend="Datos generales del donante" class="!mb-4">
        <div class="rounded-md px-5 pt-5 pb-2 bg-white">
          <InfoDonor :donor="donation?.donor" :isEditable="false" />
        </div>
      </Fieldset>

      <Fieldset legend="Datos generales de la donación" class="!mb-4">
        <div class="rounded-md px-5 pt-5 pb-2 bg-white">
          <InfoDonation :donation="donation?.donation" :isEditable="true" />
        </div>
      </Fieldset>

      <!-- Etapas del proceso -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- Examen físico -->
        <Fieldset legend="Examen Físico" class="!mb-4">
          <div class="flex justify-center items-center mb-3">
            <i v-if="donation.donation.physicalAssessmentId" class="mdi mdi-check-circle text-3xl text-green-500"></i>
            <i v-else class="mdi mdi-minus-circle text-3xl text-gray-300"></i>
          </div>

          <div class="mb-1"><span class="font-medium">Registrado el : </span>{{ donation.donation.createdAtPhysicalAssessment ? donation.donation.createdAtPhysicalAssessment : '-' }}</div>
          <div class="mb-1"><span class="font-medium">Registrado por : </span>{{ donation.donation.createdByNamePhysicalAssessment ?? '-' }}</div>
          <div class="mb-1"><span class="font-medium">Editado el : </span>{{ donation.donation.updatedAtPhysicalAssessment ? donation.donation.updatedAtPhysicalAssessment : '-' }}</div>
          <div class="mb-1"><span class="font-medium">Editado por : </span>{{ donation.donation.updatedByNamePhysicalAssessment ?? '-' }}</div>

          <div class="flex justify-center mt-3">
            <Button v-if="donation.donation.physicalAssessmentId" class="h-8 btn-view" label="Visualizar" @click="redirectExam" />
            <Button v-else label="Registrar examen físico" class="p-button-success p-button-sm" @click="redirectExam" />
          </div>
        </Fieldset>

        <!-- Entrevista -->
        <Fieldset legend="Entrevista" class="!mb-4">
          <div class="flex justify-center items-center mb-3">
            <i v-if="donation.donation.interviewAnswerId" class="mdi mdi-check-circle text-3xl text-green-500"></i>
            <i v-else class="mdi mdi-minus-circle text-3xl text-gray-300"></i>
          </div>

          <div class="mb-1"><span class="font-medium">Registrado el : </span>{{ donation.donation.createdAtInterviewAnswer ? donation.donation.createdAtInterviewAnswer : '-' }}</div>
          <div class="mb-1"><span class="font-medium">Registrado por : </span>{{ donation.donation.createdByNameInterviewAnswer ?? '-' }}</div>
          <div class="flex justify-center mt-3">
            <Button v-if="donation.donation.interviewAnswerId" class="h-8 btn-view" label="Visualizar" @click="redirectInterview" />
            <Button v-else label="Registrar entrevista" class="p-button-success p-button-sm" @click="redirectInterview" />
          </div>
        </Fieldset>

        <!-- Extracción -->
        <Fieldset legend="Extracción" class="!mb-4">
          <div class="flex justify-center items-center mb-3">
            <i v-if="donation.donation.bloodExtractionId" class="mdi mdi-check-circle text-3xl text-green-500"></i>
            <i v-else class="mdi mdi-minus-circle text-3xl text-gray-300"></i>
          </div>

          <div class="mb-1"><span class="font-medium">Registrado el : </span>{{ donation.donation.createdAtBloodExtraction ? donation.donation.createdAtBloodExtraction : '-' }}</div>
          <div class="mb-1"><span class="font-medium">Registrado por : </span>{{ donation.donation.createdByNameBloodExtraction ?? '-' }}</div>
          <div class="mb-1"><span class="font-medium">Editado el : </span>{{ donation.donation.updatedAtBloodExtraction ? donation.donation.updatedAtBloodExtraction : '-' }}</div>
          <div class="mb-1"><span class="font-medium">Editado por : </span>{{ donation.donation.updatedByNameBloodExtraction ?? '-' }}</div>

          <div class="flex justify-center mt-3">
            <Button v-if="donation.donation.bloodExtractionId" class="h-8 btn-view" label="Visualizar" @click="redirectExtraction" />
            <Button v-else label="Registrar extracción" class="p-button-success p-button-sm" @click="redirectExtraction" />
          </div>
        </Fieldset>

        <!-- Muestras y unidades -->
        <Fieldset legend="Muestras y unidades" class="!mb-4">
          <div class="flex justify-center items-center mb-3">
            <i v-if="id" class="mdi mdi-check-circle text-3xl text-green-500"></i>
            <i v-else class="mdi mdi-minus-circle text-3xl text-gray-300"></i>
          </div>

          <div class="mb-1"><span class="font-medium">Registrado el : </span>{{ donation.createdAtInterviewAnswer ? donation.createdAtInterviewAnswer : '-' }}</div>
          <div class="mb-1"><span class="font-medium">Registrado por : </span>{{ donation.createdByNameInterviewAnswer ?? '-' }}</div>
          <div class="flex justify-center mt-3">
            <Button v-if="id" class="h-8 btn-view" label="Visualizar" />
            <Button v-else label="Registrar muestras y unidades" class="p-button-success p-button-sm" @click="redirectSamples" />
          </div>
        </Fieldset>
      </div>
    </div>
    <DeferralModal v-model="showModalDeferralDonor" :options-reason="deferralOptionsGrouped" @save="deferralDonor" />
  </div>
</template>
