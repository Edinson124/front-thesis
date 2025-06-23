<script setup>
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { useInteroperabilityStore } from '@/stores/admin/interoperability';
import { required, sameAs } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const interoperabilityStore = useInteroperabilityStore();

const bloodBankId = ref(null);
const isNewAuth = ref(true);
const loading = ref(false);
const authExternalSystem = reactive({
  description: '',
  clientUser: '',
  clientSecret: '',
  confirmPassword: ''
});

onMounted(async () => {
  loading.value = true;

  bloodBankId.value = route.params.id;
  const authExternalResponse = await interoperabilityStore.getAuthExternal(bloodBankId.value);
  if (authExternalResponse) {
    // Existe -> Editamos
    isNewAuth.value = false;
    authExternalSystem.description = authExternalResponse.description || '';
    authExternalSystem.clientUser = authExternalResponse.clientUser || '';
  } else {
    // No existe -> Es nuevo
    isNewAuth.value = true;
    authExternalSystem.description = '';
    authExternalSystem.clientUser = '';
    authExternalSystem.clientSecret = '';
    authExternalSystem.confirmPassword = '';
  }

  loading.value = false;
});

const rules = computed(() => ({
  clientUser: { required: required('Usuario') },
  clientSecret: { required: required('Contraseña') },
  confirmPassword: {
    required: required('Confirmación contraseña'),
    sameAsPassword: sameAs('Confirmación contraseña', authExternalSystem.clientSecret, 'Las contraseñas no coincide')
  }
}));
const v$ = useVuelidate(rules, authExternalSystem);

const showConfirmModal = ref(false);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);

const saveBloodBank = async () => {
  const success = await interoperabilityStore.saveAuthExternal(bloodBankId.value, authExternalSystem);
  if (success) {
    showSuccessModal.value = true;
  } else {
    showErrorModal.value = true;
  }
};

const cancel = () => {
  router.push('/admin/bbexternal');
};

const handleSaveBloodBank = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  showConfirmModal.value = true;
};
</script>

<template>
  <div class="card" v-if="loading">
    <div class="flex flex-row gap-8 mb-8">
      <div class="md:w-1/5">
        <div class="w-full aspect-square mb-8">
          <Skeleton shape="circle" width="100%" height="100%"></Skeleton>
        </div>
        <Skeleton width="100%" height="100px"></Skeleton>
      </div>
      <div class="md:grow">
        <Skeleton width="100%" height="50%" class="mb-4"></Skeleton>
        <Skeleton width="100%" height="50%"></Skeleton>
      </div>
    </div>
    <div class="w-full flex items-denter justify-end mb-4 gap-4">
      <Skeleton width="8rem" height="2rem"></Skeleton>
      <Skeleton width="8rem" height="2rem"></Skeleton>
    </div>
  </div>
  <form class="card" v-if="!loading" @submit.prevent="handleSaveBloodBank">
    <div class="page-title | mb-8">
      <h3>{{ isNewAuth ? 'Registrar Credenciales Banco de Sangre' : 'Editar Credenciales Banco de Sangre' }}</h3>
    </div>
    <Fluid>
      <div class="flex flex-col md:flex-row gap-8 mb-8 md:mb-0">
        <div class="md:grow">
          <div class="flex flex-col gap-4 w-full | mb-8">
            <div class="font-semibold text-xl">Crendenciales del banco de sangre</div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <InputText id="description" v-model="authExternalSystem.description" aria-describedby="description" />
                  <label for="description">Descripción</label>
                </FloatLabel>
              </span>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <InputText id="clientUser" v-model="authExternalSystem.clientUser" :invalid="v$.clientUser?.$error" />
                  <label for="clientUser">Usuario</label>
                </FloatLabel>
                <Message v-if="v$.clientUser?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.clientUser.$errors[0].$message }}</Message>
              </span>
            </div>

            <div v-if="!isNewAuth" class="w-full flex bg-red-50 text-red-600 p-3 rounded-md mb-1 items-center justify-center">
              <i class="pi pi-exclamation-triangle mr-2 mt-0.5 text-lg"></i>
              <span>El banco de sangre externo tiene contraseña, no se muestra por seguridad, si no la recuerda puede actualizarla debajo</span>
            </div>

            <div class="font-semibold text-xl">{{ isNewAuth ? 'Registro de contraseña' : 'Cambio de contraseña' }}</div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <Password id="clientSecret" v-model="authExternalSystem.clientSecret" :toggleMask="true" fluid :feedback="false" :invalid="v$.clientSecret?.$error" />
                  <label for="clientSecret">{{ isNewAuth ? 'Contraseña' : 'Nueva contraseña' }}</label>
                </FloatLabel>
                <Message v-if="v$.clientSecret?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.clientSecret.$errors[0].$message }}</Message>
              </span>
            </div>
            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <Password id="confirmPassword" v-model="authExternalSystem.confirmPassword" :toggleMask="true" fluid :feedback="false" :invalid="v$.confirmPassword?.$error" />
                  <label for="confirmPassword">Confirmar contraseña</label>
                </FloatLabel>
                <Message v-if="v$.confirmPassword?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.confirmPassword.$errors[0].$message }}</Message>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Fluid>
    <div class="w-full flex items-denter justify-end mb-4 gap-4">
      <Button class="min-w-40 btn-clean" label="Cancelar" @click.prevent="cancel" />
      <Button class="min-w-40 p-button-success" label="Guardar" type="submit" />
    </div>
  </form>

  <ConfirmModal v-model="showConfirmModal" header="¿Estás seguro de guardar las credenciales?" accept-text="Guardar" @accept="saveBloodBank" />
  <SuccessModal v-model="showSuccessModal" message="Las credenciales fueron guardado con éxito" @close="() => router.push('/admin/bbexternal')" />
  <ErrorModal v-model="showErrorModal" />
</template>
