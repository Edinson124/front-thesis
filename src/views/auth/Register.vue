<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const password_confirmed = ref('');

const register = async () => {
  const success = await authStore.register(email, password, password_confirmed);
  if (success) {
    router.push('/');
  }
};
</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
    <div class="flex flex-col items-center justify-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
          <div class="text-center mb-8">
            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Blood Bank</div>
            <span class="text-muted-color font-medium">Registrarse</span>
          </div>

          <div>
            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
            <InputText id="email1" type="text" placeholder="Email" class="w-full md:w-[30rem] mb-8" v-model="email" />

            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
            <Password id="password1" v-model="password" placeholder="Contraseña" :toggleMask="true" class="mb-8" fluid :feedback="false"></Password>

            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Repetir contraseña</label>
            <Password id="password1" v-model="password_confirmed" placeholder="Repetir contraseña" :toggleMask="true" class="mb-8" fluid :feedback="false"></Password>

            <Button label="Registrarse" class="w-full mb-8" as="router-link" to="/" @click.prevent="register"></Button>
            <Button label="¿Ya tienes una cuenta? Inicia sesión" class="w-full" as="router-link" to="/login" severity="secondary" outlined></Button>
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
