<script setup>
import { deferralOptions } from '@/enums/DeferralType';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@/validation/validators';
import { reactive, computed } from 'vue';

const props = defineProps({
  optionsReason: {
    type: Array,
    default: () => []
  }
});

const deferral = reactive({ reason: '', type: '', days: '' });

const rulesDeferral = computed(() => ({
  reason: { required: required('Motivo de diferimiento') },
  type: { required: required('Tipo de diferimiento') },
  days: {
    required: deferral.type === 'TEMPORAL' ? required('Días de diferimiento') : false
  }
}));

const v1$ = useVuelidate(rulesDeferral, deferral, { $scope: false });

const showModal = defineModel({ type: Boolean, required: true });
const emit = defineEmits(['save']);

const hasGroups = computed(() => {
  return props.optionsReason.length > 0 && props.optionsReason[0]?.options !== undefined;
});
const close = () => {
  showModal.value = false;
};

const save = async () => {
  const isValid = await v1$.value.$validate();
  if (!isValid) return;
  emit('save', deferral);
  close();
};

const cancel = async () => {
  deferral.reason = '';
  deferral.days = '';
  deferral.type = '';
  close();
};
</script>

<template>
  <Dialog v-model:visible="showModal" header="Diferir donante" modal class="w-[35rem] p-2">
    <div>
      <FloatLabel variant="on" class="mt-4">
        <Select
          id="reason"
          v-model="deferral.reason"
          :options="optionsReason"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          filter
          :invalid="v1$.reason?.$error"
          v-bind="hasGroups ? { optionGroupLabel: 'label', optionGroupChildren: 'options' } : {}"
        />
        <label for="reason">Motivo de diferimiento</label>
      </FloatLabel>
      <Message v-if="v1$.reason?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v1$.reason.$errors[0].$message }}</Message>

      <FloatLabel variant="on" class="mt-4">
        <Select id="type" v-model="deferral.type" :options="deferralOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v1$.type?.$error" />
        <label for="type">Tipo de diferimiento</label>
      </FloatLabel>
      <Message v-if="v1$.type?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v1$.type.$errors[0].$message }}</Message>

      <FloatLabel v-if="deferral.type === 'TEMPORAL'" variant="on" class="mt-4 w-full">
        <InputText id="days" v-model="deferral.days" class="w-full" :invalid="v1$.days?.$error" />
        <label for="days">Días</label>
      </FloatLabel>
      <Message v-if="deferral.type === 'TEMPORAL' && v1$.days?.$error" severity="error" size="small" variant="simple" class="pt-1">
        {{ v1$.days.$errors[0].$message }}
      </Message>
    </div>
    <template #footer>
      <Button label="Cancelar" class="min-w-40 btn-clean" @click="cancel" />
      <Button label="Aceptar" class="min-w-40 p-button-success" @click="save" />
    </template>
  </Dialog>
</template>
