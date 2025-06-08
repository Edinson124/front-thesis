<script setup>
import { useConfirm } from 'primevue';
import { watch } from 'vue';

const confirm = useConfirm();

const props = defineProps({
  id: {
    type: String,
    default: 'error-modal'
  },
  header: {
    type: String,
    default: '¡Ha ocurrido un error!'
  },
  message: {
    type: String,
    default: 'Lo sentimos, no pudimos completar su solicitud.'
  },
  moreMessage: {
    type: String,
    default: 'Por favor, intente de nuevo más tarde.'
  },
  closeText: {
    type: String,
    default: 'Cerrar'
  }
});

const showModal = defineModel({ type: Boolean, default: false });

const emit = defineEmits(['close']);

const openModal = () => {
  confirm.require({
    group: props.id,
    header: props.header,
    message: props.message,
    moreMessage: props.moreMessage,
    accept: () => {
      showModal.value = false;
      emit('close');
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
</script>

<template>
  <ConfirmDialog :group="id">
    <template #container="{ message, acceptCallback }">
      <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
        <div class="rounded-full bg-red-500 text-white inline-flex justify-center items-center h-24 w-24 -mt-20">
          <i class="pi pi-times-circle !text-4xl"></i>
        </div>
        <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
        <p class="mb-0">{{ message.message }}</p>
        <p v-if="message.moreMessage" class="mb-0">{{ message.moreMessage }}</p>
        <div class="flex justify-center mt-6 gap-2">
          <Button class="min-w-40 btn-clean" :label="closeText" @click="acceptCallback"></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>
