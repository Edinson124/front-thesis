<script setup>
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { isInternalOptions } from '@/enums/BloodBank';
import userService from '@/services/admin/users';
import ubicationService from '@/services/ubication';
import { useBloodBanksStore } from '@/stores/admin/blodd-banks';
import { required, requiredIf } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const bloodBankStore = useBloodBanksStore();

const isNewBloodBank = ref(true);
const loading = ref(false);
const bloodBank = reactive({
  name: '',
  address: '',
  region: null,
  province: null,
  district: null,
  idType: null,
  isInternal: true
});

const bloodBankImage = ref('/src/assets/images/blood-bank.png');
const imageInput = ref(null);
const onUploadImage = () => {
  imageInput.value.click();
};
const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    bloodBankImage.value = URL.createObjectURL(file);
  }
};

const departments = reactive([]);
const loadingDeparments = ref(false);
const provinces = reactive([]);
const loadingProvinces = ref(false);
const distritos = reactive([]);
const loadingDistritos = ref(false);
const medicUsers = ref([]);
const getMedicOptionsCoordinator = async (bloodBankId) => {
  try {
    const response = await userService.getUserMedicByBloodBank(bloodBankId);
    medicUsers.value = response;
  } catch (error) {
    console.error('Error obteniendo variables:', error);
  }
};
onMounted(async () => {
  loading.value = true;

  await bloodBankStore.getBloodBankTypes();

  const bloodBankId = route.params.id;
  if (bloodBankId) {
    isNewBloodBank.value = false;
    const bloodBankResponse = await bloodBankStore.getBloodBank(bloodBankId);
    Object.assign(bloodBank, { ...bloodBank, ...bloodBankResponse });
    if (bloodBank.isInternal) await getMedicOptionsCoordinator(bloodBankId);
  }

  const departmentsResponse = await ubicationService.getDepartments();
  departments.splice(0, departments.length, ...departmentsResponse);
  loadingDeparments.value = false;

  if (bloodBank.region) {
    loadingProvinces.value = true;
    const provincesResponse = await ubicationService.getProvinces(bloodBank.region);
    provinces.splice(0, provinces.length, ...provincesResponse);
    loadingProvinces.value = false;
  }

  if (bloodBank.province) {
    loadingDistritos.value = true;
    const distritosResponse = await ubicationService.getDistritos(bloodBank.region, bloodBank.province);
    distritos.splice(0, distritos.length, ...distritosResponse);
    loadingDistritos.value = false;
  }

  loading.value = false;
});

const onSelectDepartment = async (event) => {
  loadingProvinces.value = true;
  let provincesResponse = [];
  if (event.value !== null) {
    provincesResponse = await ubicationService.getProvinces(event.value);
  }
  provinces.splice(0, provinces.length, ...provincesResponse);
  loadingProvinces.value = false;
};

const onSelectProvince = async (event) => {
  loadingDistritos.value = true;
  let distritosResponse = [];
  if (event.value !== null) {
    distritosResponse = await ubicationService.getDistritos(bloodBank.region, event.value);
  }
  distritos.splice(0, distritos.length, ...distritosResponse);
  loadingDistritos.value = false;
};

const rules = computed(() => ({
  name: { required: required('Nombre') },
  address: { required: required('Dirección') },
  region: { required: required('Región') },
  province: { requiredIf: requiredIf('Provincia', () => bloodBank.region) },
  district: { requiredIf: requiredIf('Distrito', () => bloodBank.province) },
  idType: { required: required('Tipo de banco de sangre') },
  isInternal: { required: required('Acceso') }
}));
const v$ = useVuelidate(rules, bloodBank);

const showConfirmModal = ref(false);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);

const saveBloodBank = async () => {
  const saveMethod = isNewBloodBank.value ? bloodBankStore.newBloodBank : bloodBankStore.editBloodBank;
  const success = await saveMethod(bloodBank);
  if (success) {
    showSuccessModal.value = true;
  } else {
    showErrorModal.value = true;
  }
};

const cancel = () => {
  router.push('/admin/blood-banks');
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
      <h3 v-if="isNewBloodBank">Registro de nuevo banco de sangre</h3>
      <h3 v-else>Editar Banco de sangre</h3>
    </div>
    <Fluid>
      <div class="flex flex-col md:flex-row gap-8 mb-8 md:mb-0">
        <div class="md:w-1/5">
          <div class="flex flex-col justify-center w-full gap-4 mb-8">
            <Image class="w-full aspect-square" alt="Image">
              <template #image>
                <img class="w-full object-cover aspect-square" :src="bloodBankImage" alt="Image" />
              </template>
            </Image>
            <input type="file" ref="imageInput" @change="handleImageChange" style="display: none" accept="image/*" />
            <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Editar Imagen" severity="info" @click="onUploadImage" />
          </div>
        </div>
        <div class="md:grow">
          <div class="flex flex-col gap-4 w-full | mb-8">
            <div class="font-semibold text-xl">Información del banco de sangre</div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <InputText id="name" v-model="bloodBank.name" aria-describedby="name" :invalid="v$.name?.$error" />
                  <label for="name">Nombre</label>
                </FloatLabel>
                <Message v-if="v$.name?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.name.$errors[0].$message }}</Message>
              </span>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <Select id="id_region" v-model="bloodBank.region" :options="departments" showClear filter @change="onSelectDepartment" :loading="loadingDeparments" :invalid="v$.region?.$error" />
                  <label for="id_region">Departamento</label>
                </FloatLabel>
                <Message v-if="v$.region?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.region.$errors[0].$message }}</Message>
              </span>

              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <Select id="id_province" v-model="bloodBank.province" :options="provinces" showClear filter @change="onSelectProvince" :disabled="bloodBank.region === null" :loading="loadingProvinces" :invalid="v$.province?.$error" />
                  <label for="id_province">Provincia</label>
                </FloatLabel>
                <Message v-if="v$.province?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.province.$errors[0].$message }}</Message>
              </span>

              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <Select id="id_district" v-model="bloodBank.district" :options="distritos" showClear filter :disabled="bloodBank.province === null" :loading="loadingDistritos" :invalid="v$.district?.$error" />
                  <label for="id_district">Distrito</label>
                </FloatLabel>
                <Message v-if="v$.district?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.district.$errors[0].$message }}</Message>
              </span>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <InputText id="address" v-model="bloodBank.address" aria-describedby="address" :invalid="v$.address?.$error" />
                  <label for="address">Dirección</label>
                </FloatLabel>
                <Message v-if="v$.address?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.address.$errors[0].$message }}</Message>
              </span>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:mb-0">
                <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                  <Select id="status" v-model="bloodBank.idType" :options="bloodBankStore.bloodBanksTypes" optionLabel="name" optionValue="id" :invalid="v$.idType?.$error" />
                  <label for="status">Tipo de banco de sangre</label>
                </FloatLabel>
                <Message v-if="v$.idType?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.idType.$errors[0].$message }}</Message>
              </span>
            </div>

            <!-- <div class="grid grid-cols-12 gap-4">
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <Select id="status" v-model="bloodBank.status" :options="statusesOptions" optionLabel="label" optionValue="value" disabled />
                <label for="status">Estado</label>
              </FloatLabel>
            </div> -->
          </div>
          <div class="flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Acceso del banco de sangre</div>
            <div class="grid grid-cols-12 gap-2">
              <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Acceso al sistema: </label>
              <div class="col-span-12 md:col-span-4">
                <Select class="" v-model="bloodBank.isInternal" :options="isInternalOptions" optionLabel="label" optionValue="value" :invalid="v$.isInternal?.$error" />
                <Message v-if="v$.isInternal?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.isInternal.$errors[0].$message }}</Message>
              </div>
            </div>
          </div>
          <div v-if="bloodBank.isInternal" class="flex flex-col gap-4 w-full mt-2">
            <div class="font-semibold text-xl">Coordinador</div>
            <div class="grid grid-cols-12 gap-2">
              <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Coordinador de banco de sangre</label>
              <div class="col-span-12 md:col-span-4">
                <Select class="" v-model="bloodBank.idCoordinator" :options="medicUsers" optionLabel="fullName" optionValue="id" showClear />
              </div>
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

  <ConfirmModal v-model="showConfirmModal" header="¿Estás seguro de guardar este banco de sangre?" accept-text="Guardar" @accept="saveBloodBank" />
  <SuccessModal v-model="showSuccessModal" message="El banco de sangre fue guardado con éxito" @close="() => router.push('/admin/blood-banks')" />
  <ErrorModal v-model="showErrorModal" />
</template>
