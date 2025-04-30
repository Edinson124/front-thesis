<script setup>
import { Countries } from '@/enums/Countries';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  id: String,
  code_label: String,
  label: String,
  invalid: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue);
const countryList = ref(Countries);

const selectedCountry = ref(countryList.value.find((c) => c.code === 'PE'));

const formatPhone = (number) => {
  return number.replace(/(\d{3})(?=\d)/g, '$1 ');
};
const unformatPhone = (number) => {
  return number.replace(/\s/g, '');
};

const formattedValue = computed(() => {
  return selectedCountry.value?.code ? `${selectedCountry.value.dialCode}-${unformatPhone(internalValue.value)}` : internalValue.value;
});

const parseModelValue = (value) => {
  const parts = value.split('-');
  if (parts.length === 2) {
    const country = countryList.value.find((c) => c.dialCode === parts[0]);

    if (country) {
      selectedCountry.value = country;
      internalValue.value = formatPhone(parts[1]);
    } else {
      internalValue.value = formatPhone(value);
    }
  } else {
    internalValue.value = formatPhone(value);
  }
};

onMounted(() => {
  parseModelValue(props.modelValue);
});

watch(
  () => props.modelValue,
  (newValue) => {
    parseModelValue(newValue);
  }
);

watch([selectedCountry, internalValue], () => {
  emit('update:modelValue', formattedValue.value);
});

const formatInput = (event) => {
  internalValue.value = formatPhone(event.target.value);
};
const checkDigit = (event) => {
  if (event.key.length === 1 && isNaN(Number(event.key))) {
    event.preventDefault();
  }
};
</script>

<template>
  <InputGroup class="">
    <FloatLabel variant="on" class="!flex-[0_1_auto] !w-4/12">
      <Select id="code" v-model="selectedCountry" :options="countryList" optionLabel="name" filter :invalid="invalid">
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center">{{ slotProps.value.emoji }} {{ slotProps.value.dialCode }}</div>
          <span v-else> -- </span>
        </template>
        <template #option="slotProps">
          <div class="flex items-center">{{ slotProps.option.emoji }} {{ slotProps.option.dialCode }} {{ slotProps.option.name }}</div>
        </template>
      </Select>
      <label for="code">{{ code_label }}</label>
    </FloatLabel>
    <FloatLabel variant="on">
      <InputText :id="id" class="" v-model="internalValue" @keydown="checkDigit" @input="formatInput" inputmode="numeric" :invalid="invalid" />
      <label :for="id">{{ label }}</label>
    </FloatLabel>
  </InputGroup>
</template>
