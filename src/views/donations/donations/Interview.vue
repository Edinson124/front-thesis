<script setup>
// import { DonorInterviewQuestions } from '@/enums/DonorInterviewQuestions';
import DeferralModal from '@/components/donation/DeferralModal.vue';
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { deferralOptionsInterview } from '@/enums/DeferralType';
import router from '@/router';
import { useDonationStore } from '@/stores/donation/donations';
import { useInterviewStore } from '@/stores/donation/interview';
import { requiredIfMessage, requiredMessage } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { useToast } from 'primevue';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const answers = ref({});
const DonorInterviewQuestions = ref({});
const interviewStore = useInterviewStore();
const donationStore = useDonationStore();
const route = useRoute();

const isLoading = ref(true);
const donationId = ref(null);
const activeTab = ref(null);
const toast = useToast();
const refTitle = ref(null);
const newInterview = ref(true);
const showModalDeferralDonor = ref(false);
const openModalRegister = ref(false);
const editDonation = ref(null);
const savedAnswersInterview = ref(null);

const showConfirmModal = ref(false);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);

const showCancelConfirmDialog = ref(false);

const rules = computed(() => {
  const rulesObject = {};

  if (!DonorInterviewQuestions.value || !DonorInterviewQuestions.value.sections) {
    return { answers: rulesObject };
  }

  for (const section of DonorInterviewQuestions.value.sections) {
    for (const question of section.questions) {
      if (question.type === 'subtitle') continue;

      rulesObject[question.id] = {};

      if (question.required) {
        if (question.depends && question.depends.length > 0) {
          rulesObject[question.id].required = requiredIfMessage('Pregunta obligatoria', () => {
            return question.depends.every((dep) => {
              const answer = answers.value[dep.questionId];
              return dep.value.includes(answer);
            });
          });
        } else {
          rulesObject[question.id].required = requiredMessage('Pregunta obligatoria');
        }
      }
    }
  }

  return { answers: rulesObject };
});

const v$ = useVuelidate(rules, { answers });

const deferralDonor = async (deferral) => {
  const response = await donationStore.deferralDonor(donationId.value, deferral);
  if (response) {
    returnDonationView();
  }
};

const openDeferralDonorModal = () => {
  if (newInterview.value) {
    openModalRegister.value = true;
    return;
  }
  showModalDeferralDonor.value = true;
};

const cancel = () => {
  if (newInterview.value) {
    showCancelConfirmDialog.value = true;
  } else {
    returnDonationView();
  }
};

const returnDonationView = () => {
  router.push({ path: 'view', query: { donationId: donationId.value } });
};

const saveInterview = async () => {
  const response = await interviewStore.createInterviewAnswer(savedAnswersInterview.value, donationId.value);
  if (response) {
    showSuccessModal.value = true;
  } else {
    showErrorModal.value = true;
  }
};

const handleSave = async () => {
  const isValid = await v$.value.$validate();
  if (isValid) {
    const savedAnswers = {};

    for (const section of DonorInterviewQuestions.value.sections) {
      for (const question of section.questions) {
        if (question.type === 'subtitle') continue;

        const userAnswer = answers.value[question.id];

        if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
          savedAnswers[question.id] = {
            answer: userAnswer,
            name: question.name
          };
        }
      }
    }
    savedAnswersInterview.value = savedAnswers;
    showConfirmModal.value = true;
  } else {
    console.log('Hay errores en el formulario.');

    for (const section of DonorInterviewQuestions.value.sections) {
      let sectionWithError = false;
      for (const question of section.questions) {
        if (question.type === 'subtitle') continue;
        if (v$.value.answers[question.id]?.$error) {
          activeTab.value = section.id;
          sectionWithError = true;
          break;
        }
      }
      if (sectionWithError) {
        break;
      }
    }

    nextTick(() => {
      const el = refTitle.value;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    toast.add({
      severity: 'error',
      summary: 'Formulario incompleto',
      detail: 'Por favor completa todos los campos obligatorios.',
      life: 4000
    });
  }
};

onMounted(async () => {
  const response = await interviewStore.getInterviewStructure();
  DonorInterviewQuestions.value = response;
  const donationRoute = route.query.donationId;
  donationId.value = donationRoute;
  const donationResponse = await donationStore.getDonation(donationId.value);
  editDonation.value = donationResponse.donation.status === 'En proceso';

  if (donationId.value) {
    const answersResponse = await interviewStore.getInterviewAnswers(donationId.value);
    if (answersResponse) {
      newInterview.value = false;
      for (const [key, value] of Object.entries(answersResponse.answer)) {
        answers.value[key] = typeof value === 'object' && 'answer' in value ? value.answer : '';
      }

      for (const section of DonorInterviewQuestions.value.sections || []) {
        for (const question of section.questions || []) {
          const qid = question.id;

          // Si no hay respuesta, inicializa con el valor adecuado
          if (!(qid in answers.value)) {
            answers.value[qid] = question.type === 'datepicker' ? null : '';
          }

          // Si es datepicker y la respuesta es string, intenta convertirla a Date
          if (question.type === 'datepicker' && typeof answers.value[qid] === 'string') {
            const parsedDate = new Date(answers.value[qid]);
            answers.value[qid] = isNaN(parsedDate) ? null : parsedDate;
          }
        }
      }
    }
  }

  activeTab.value = DonorInterviewQuestions.value.sections?.[0]?.id ?? null;
  isLoading.value = false;
});
</script>

<template>
  <div v-if="isLoading" class="card absolute inset-0 bg-white/50 flex items-center justify-center z-10">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else class="card">
    <div class="mb-4 flex flex-wrap justify-between items-center gap-2" ref="refTitle">
      <h3 class="min-w-[10rem] !mt-2">Entrevista de donación</h3>
      <Button v-if="editDonation" class="h-8 w-full md:grow max-w-[16rem] md:max-w-[16rem]" label="Diferir donante" severity="danger" @click="openDeferralDonorModal" />
    </div>

    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab v-for="section in DonorInterviewQuestions.sections" :value="section.id" :key="section.id">{{ section.name }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="section in DonorInterviewQuestions.sections" :value="section.id" :key="section.id">
          <Panel :header="section.name">
            <template v-for="question in section.questions" :key="question.id">
              <div class="flex items-center justify-between gap-4 px-8 mt-10 mb-6" v-if="question.type === 'subtitle'">
                <h5 class="m-0">{{ question.name }}</h5>
              </div>

              <div class="flex items-center justify-between gap-4 px-8 mt-6 mb-2" v-else-if="question.type === 'text'">
                <span class="w-full md:max-w-[50%]">{{ question.name }}</span>
                <InputText class="h-8 w-full md:grow" v-model="answers[question.id]" :disabled="!newInterview" />
              </div>

              <div class="flex items-center justify-between gap-4 px-8 mt-6 mb-2" v-else-if="question.type === 'radio'">
                <span>{{ question.name }}</span>
                <div class="flex items-center gap-8">
                  <div class="flex items-center gap-2" v-for="(option, index) in question.options" :key="index">
                    <RadioButton :inputId="`${question.id}-${index}`" :name="`option-${index}`" :value="option" v-model="answers[question.id]" :disabled="!newInterview" />
                    <label :for="`${question.id}-${index}`">{{ option }}</label>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between gap-4 px-8 mt-6 mb-2" v-else-if="question.type === 'select'">
                <span class="w-full md:max-w-[50%]">{{ question.name }}</span>
                <Select class="w-full md:w-[16rem]" v-model="answers[question.id]" :options="question.options" placeholder="Seleccionar" :disabled="!newInterview" />
              </div>

              <div class="flex items-center justify-between gap-4 px-8 mt-6 mb-2" v-else-if="question.type === 'datepicker'">
                <span class="w-full md:max-w-[50%]">{{ question.name }}</span>
                <DatePicker class="w-full md:w-[16rem]" showIcon fluid v-model="answers[question.id]" placeholder="Seleccionar" :disabled="!newInterview" />
              </div>

              <div class="flex flex-col items-start gap-4 px-8 mt-10 mb-6" v-else-if="question.type === 'textarea'">
                <span class="w-full md:max-w-[50%]">{{ question.name }}</span>
                <Textarea class="w-full md:grow resize-none" rows="5" v-model="answers[question.id]" :disabled="!newInterview" />
              </div>

              <Message v-if="v$.answers[question.id]?.$error" severity="error" size="small" variant="simple" class="px-8 mb-6">{{ v$.answers[question.id].$errors[0].$message }}</Message>
            </template>
          </Panel>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <div class="flex justify-end px-8 my-8 gap-4">
      <Button class="h-10 w-full md:max-w-[16rem] btn-clean" label="Cancelar" @click="cancel" />
      <Button v-if="newInterview" class="h-10 w-full md:max-w-[16rem]" label="Guardar" severity="success" @click="handleSave" />
    </div>
    <DeferralModal v-model="showModalDeferralDonor" :options-reason="deferralOptionsInterview" @save="deferralDonor" />

    <Dialog v-model:visible="openModalRegister" header=" " :modal="true" class="w-[30rem]">
      <p><strong>Debe registrar primero la entrevista para poder diferir al donante</strong></p>
      <template #footer>
        <Button label="Aceptar" class="min-w-40 p-button-success" @click="() => (openModalRegister = false)" />
      </template>
    </Dialog>
    <ConfirmModal id="confirmSaveInterview" v-model="showConfirmModal" header="¿Estás seguro de guardar las respuestas a la entrevista?" accept-text="Guardar" @accept="saveInterview" />
    <SuccessModal v-model="showSuccessModal" message="Las repuestas a la entrevista fueron guardados con éxito" @close="returnDonationView" />
    <ErrorModal v-model="showErrorModal" />

    <ConfirmModal id="cancelSaveInterview" v-model="showCancelConfirmDialog" header="¿Estás seguro de que deseas cancelar la operación?" accept-text="Sí" accept-button-class="p-button-danger" @accept="returnDonationView" reject-text="No" />
  </div>
</template>
