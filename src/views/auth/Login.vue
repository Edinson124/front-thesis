<script setup>
import { useAuthStore } from '@/stores/auth';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const userLogin = reactive({
  username: '',
  password: ''
});

const credentialsError = ref('');

const rules = computed(() => {
  return {
    username: {
      required: required('Usuario')
    },
    password: {
      required: required('Contraseña')
    }
  };
});

const v$ = useVuelidate(rules, userLogin);

const login = async () => {
  credentialsError.value = '';
  const isValid = await v$.value.$validate();
  if (!isValid) {
    return;
  }

  const success = await authStore.login(userLogin.username, userLogin.password);
  if (success) {
    router.push('/');
  } else {
    credentialsError.value = 'Credenciales no válidas. Por favor, inténtalo de nuevo.';
  }
};
</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
    <div class="flex flex-col items-center justify-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
          <div class="text-center mb-8">
            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Yawar Soft</div>
            <span class="text-muted-color font-medium">Inicia sesión</span>
          </div>

          <div>
            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Usuario</label>
            <InputText id="email1" type="text" placeholder="Usuario" class="w-full md:w-[30rem] mb-4" v-model="userLogin.username" />
            <Message v-if="v$.username?.$error" severity="error" size="small" variant="simple" class="pt-0 mt-0 mb-8">{{ v$.username?.$errors[0].$message }}</Message>

            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
            <Password id="password1" v-model="userLogin.password" placeholder="Contraseña" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
            <Message v-if="v$.password?.$error" severity="error" size="small" variant="simple" class="pt-0 mt-0 mb-4">{{ v$.password?.$errors[0].$message }}</Message>

            <Message v-if="credentialsError" severity="error" size="small" variant="simple" class="pt-0 mt-0 mb-4">{{ credentialsError }}</Message>

            <div class="flex items-center justify-end mt-2 mb-8 gap-8">
              <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">¿Olvidaste tu contraseña?</span>
            </div>
            <Button label="Iniciar sesión" class="w-full mb-8 btn-primary" @click.prevent="login"></Button>
            <!-- <Button label="Crear una cuenta nueva" class="w-full" as="router-link" to="/register" severity="secondary" outlined></Button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
