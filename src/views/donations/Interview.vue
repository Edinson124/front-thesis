<script setup>
import { DonorInterviewQuestions } from '@/enums/DonorInterviewQuestions';
import router from '@/router';
import { requiredIfMessage, requiredMessage } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, ref } from 'vue';

const answers = ref({});

const rules = computed(() => {
  const rulesObject = {};

  for (const section of DonorInterviewQuestions.sections) {
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

const handleSave = async () => {
  const isValid = await v$.value.$validate();
  if (isValid) {
    const savedAnswers = {};

    for (const section of DonorInterviewQuestions.sections) {
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

    console.log('Formulario válido. Guardando...');
    console.log(savedAnswers);
  } else {
    console.log('Hay errores en el formulario.');
  }
};
</script>

<template>
  <div class="card">
    <div class="mb-4 flex justify-end">
      <Button class="h-8 w-full md:grow md:max-w-[16rem]" label="Diferir donante" severity="danger" @click="() => {}" />
    </div>

    <Tabs :value="DonorInterviewQuestions.sections[0].id">
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
                <InputText class="h-8 w-full md:grow" v-model="answers[question.id]" />
              </div>

              <div class="flex items-center justify-between gap-4 px-8 mt-6 mb-2" v-else-if="question.type === 'radio'">
                <span>{{ question.name }}</span>
                <div class="flex items-center gap-8">
                  <div class="flex items-center gap-2" v-for="(option, index) in question.options" :key="index">
                    <RadioButton :inputId="`${question.id}-${index}`" :name="`option-${index}`" :value="option" v-model="answers[question.id]" />
                    <label :for="`${question.id}-${index}`">{{ option }}</label>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between gap-4 px-8 mt-6 mb-2" v-else-if="question.type === 'select'">
                <span class="w-full md:max-w-[50%]">{{ question.name }}</span>
                <Dropdown class="w-full md:w-[16rem]" v-model="answers[question.id]" :options="question.options" placeholder="Seleccionar" />
              </div>

              <div class="flex items-center justify-between gap-4 px-8 mt-6 mb-2" v-else-if="question.type === 'datepicker'">
                <span class="w-full md:max-w-[50%]">{{ question.name }}</span>
                <DatePicker class="w-full md:w-[16rem]" v-model="answers[question.id]" placeholder="Seleccionar" />
              </div>

              <div class="flex flex-col items-start gap-4 px-8 mt-10 mb-6" v-else-if="question.type === 'textarea'">
                <span class="w-full md:max-w-[50%]">{{ question.name }}</span>
                <Textarea class="w-full md:grow" rows="8" v-model="answers[question.id]" />
              </div>

              <Message v-if="v$.answers[question.id]?.$error" severity="error" size="small" variant="simple" class="px-8 mb-6">{{ v$.answers[question.id].$errors[0].$message }}</Message>
            </template>
          </Panel>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <div class="flex justify-end px-8 my-8 gap-4">
      <Button
        class="h-10 w-full md:max-w-[16rem] btn-clean"
        label="Cancelar"
        @click="
          () => {
            router.back();
          }
        "
      />
      <Button class="h-10 w-full md:max-w-[16rem]" label="Guardar" severity="success" @click="handleSave" />
    </div>
  </div>
</template>
