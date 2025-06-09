<script setup>
import { useConfirm } from 'primevue';
import { computed, watch } from 'vue';

const confirm = useConfirm();

const props = defineProps({
  id: {
    type: String,
    default: 'confirm-modal'
  },
  header: {
    type: String,
    default: '¿Estás seguro de realizar esta acción?'
  },
  message: {
    type: String,
    default: 'Por favor confirma para continuar'
  },
  moreMessage: {
    type: String,
    default: ''
  },
  acceptText: {
    type: String,
    default: 'Aceptar'
  },
  acceptButtonClass: {
    type: String,
    default: 'p-button-success'
  },
  rejectText: {
    type: String,
    default: 'Cancelar'
  },
  severity: {
    type: String,
    default: 'question' // Valores posibles: 'question', 'info', 'warn', 'danger'
  }
});

const showModal = defineModel({ type: Boolean, default: false });

const emit = defineEmits(['accept', 'reject']);

const openModal = () => {
  confirm.require({
    group: props.id,
    header: props.header,
    message: props.message,
    accept: () => {
      showModal.value = false;
      emit('accept');
    },
    reject: () => {
      showModal.value = false;
      emit('reject');
    }
  });
};

watch(
  () => showModal.value,
  (newVal) => {
    if (newVal) {
      openModal();
    }
  }
);

const iconClass = computed(() => {
  switch (props.severity) {
    case 'info':
      return 'pi pi-info-circle';
    case 'warn':
      return 'pi pi-exclamation-triangle';
    case 'danger':
      return 'pi pi-times-circle';
    case 'question':
    default:
      return 'pi pi-question';
  }
});

const circleBgClass = computed(() => {
  switch (props.severity) {
    case 'info':
      return 'bg-blue-500';
    case 'warn':
      return 'bg-yellow-500';
    case 'danger':
      return 'bg-red-500';
    case 'question':
    default:
      return 'bg-primary';
  }
});
</script>

<template>
  <ConfirmDialog :group="id">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
        <div :class="['rounded-full', circleBgClass, 'text-white', 'inline-flex', 'justify-center', 'items-center', 'h-24', 'w-24', '-mt-20']">
          <i :class="[iconClass, '!text-4xl']"></i>
        </div>
        <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
        <p class="mb-0">{{ message.message }}</p>
        <p v-if="message.moreMessage" class="mb-0">{{ message.moreMessage }}</p>
        <div class="flex justify-center mt-6 gap-2">
          <Button class="min-w-40 btn-clean" :label="rejectText" @click="rejectCallback"></Button>
          <Button :class="['min-w-40', acceptButtonClass]" :label="acceptText" @click="acceptCallback"></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>
