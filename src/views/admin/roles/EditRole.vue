<script setup>
import { Status } from '@/enums/Status';
import { useRolesStore } from '@/stores/roles';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const rolesStore = useRolesStore();

const isNewRole = ref(true);
const loading = ref(false);
const role = reactive({
  id: '',
  name: '',
  description: '',
  status: '',
  permissions: []
});

onMounted(async () => {
  loading.value = true;

  await rolesStore.getAllPermissions();

  const roleId = route.params.id;
  if (roleId) {
    isNewRole.value = false;
    const roleResponse = await rolesStore.getRole(roleId);
    Object.assign(role, { ...role, ...roleResponse });
  }

  loading.value = false;
});

const statuses = ['ACTIVE', 'INACTIVE'];
const statusesOptions = statuses.map((status) => ({
  value: status,
  label: Status[status]
}));

const rules = computed(() => ({}));
const v$ = useVuelidate(rules, role);

const save = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  const saveMethod = isNewRole.value ? rolesStore.editRole : rolesStore.editRole;
  const success = await saveMethod(role);
  if (success) {
    router.push('/admin/roles');
  }
};

const cancel = () => {
  router.push('/admin/roles');
};
</script>

<template>
  <div class="card" v-if="loading">
    <div class="flex flex-row gap-8 mb-8">
      <div class="md:w-1/2">
        <Skeleton width="100%" height="300px"></Skeleton>
      </div>
      <div class="md:grow">
        <Skeleton width="100%" height="300px"></Skeleton>
      </div>
    </div>
    <div class="w-full flex items-denter justify-end mb-4 gap-4">
      <Skeleton width="8rem" height="2rem"></Skeleton>
      <Skeleton width="8rem" height="2rem"></Skeleton>
    </div>
  </div>
  <form class="card" v-if="!loading" @submit.prevent="save">
    <div class="page-title | mb-8">
      <h3 v-if="isNewRole">Registro de nuevo rol</h3>
      <h3 v-else>Editar rol</h3>
    </div>
    <Fluid class="h-[80%]">
      <div class="flex flex-col md:flex-row gap-8 mb-8 md:mb-0 h-full">
        <div class="md:w-1/2 h-full">
          <div class="flex flex-col gap-4 w-full | mb-8">
            <div class="font-semibold text-xl">Información del rol</div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:col-span-12 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <InputText id="name" v-model="role.name" aria-describedby="name" :invalid="v$.name?.$error" />
                  <label for="name">Nombre</label>
                </FloatLabel>
                <Message v-if="v$.name?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.name.$errors[0].$message }}</Message>
              </span>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:col-span-12 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <Textarea id="description" v-model="role.description" rows="10" aria-describedby="description" :invalid="v$.description?.$error" />
                  <label for="description">Descripción</label>
                </FloatLabel>
                <Message v-if="v$.description?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.description.$errors[0].$message }}</Message>
              </span>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <Select id="status" v-model="role.status" :options="statusesOptions" optionLabel="label" optionValue="value" disabled />
                  <label for="status">Estado</label>
                </FloatLabel>
              </span>
            </div>
          </div>
        </div>
        <div class="md:grow h-full">
          <div class="flex flex-col gap-4 w-full h-full | mb-8">
            <Panel header="Permisos" class="h-[370px]">
              <ScrollPanel
                class="custom-scroll"
                style="width: 100%; height: 300px"
                :dt="{
                  bar: {
                    background: '{primary.color}'
                  }
                }"
              >
                <div v-for="permission in rolesStore.allPermissions" :key="permission.id" class="mb-4">
                  <Checkbox class="mr-2" v-model="role.permissions" :inputId="'perm-' + permission.id" :value="permission.id" />
                  <label :for="'perm-' + permission.id"> {{ permission.name }} </label>
                </div>
              </ScrollPanel>
            </Panel>
          </div>
        </div>
      </div>
    </Fluid>
    <div class="w-full flex items-denter justify-end mb-4 gap-4">
      <Button class="min-w-40" label="Cancelar" text @click.prevent="cancel" />
      <Button class="min-w-40 p-button-success" label="Guardar" type="submit" />
    </div>
  </form>
</template>

<style>
.custom-scroll .p-scrollpanel-bar.p-scrollpanel-bar-y {
  opacity: 1 !important;
}
</style>
