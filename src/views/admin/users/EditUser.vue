<script setup>
import InputPhone from '@/components/utils/InputPhone.vue';
import { DocumentTypes } from '@/enums/DocumentTypes';
import { Gender } from '@/enums/Gender';
import { Status } from '@/enums/Status';
import ubicationService from '@/services/ubication';
import { useBloodBanksStore } from '@/stores/blodd-banks';
import { useRolesStore } from '@/stores/roles';
import { useUsersStore } from '@/stores/users';
import { email, minLength, required, requiredIf } from '@/validation/validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();
const rolesStore = useRolesStore();
const bloodBanksStore = useBloodBanksStore();

const isNewUser = ref(true);
const loadingUser = ref(false);
const user = reactive({
  documentType: '',
  documentNumber: '',
  firstName: '',
  lastName: '',
  secondLastName: '',
  birthDate: null,
  gender: '',
  email: '',
  phone: '',
  region: null,
  province: null,
  district: null,
  address: '',
  status: 'ACTIVE',
  bloodBankId: null,
  profileImageUrl: ''
});

const maxDate = ref(new Date());

const documentTypesOptions = Object.entries(DocumentTypes).map(([value, label]) => ({
  value,
  label
}));

const genderOptions = Object.entries(Gender).map(([value, label]) => ({
  value,
  label
}));

const departments = reactive([]);
const loadingDeparments = ref(false);
const provinces = reactive([]);
const loadingProvinces = ref(false);
const distritos = reactive([]);
const loadingDistritos = ref(false);

const userImage = ref('/src/assets/images/profile.png');
const imageInput = ref(null);
const onUploadImage = () => {
  imageInput.value.click();
};
const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    userImage.value = URL.createObjectURL(file);
  }
};

function stringToDate(fechaString) {
  const partes = fechaString.split('/');
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1;
  const anio = parseInt(partes[2], 10);

  return new Date(anio, mes, dia);
}

function calculateAge(birthDate) {
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += lastDayOfMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

const years = computed(() => {
  if (!user.birthDate) return '';
  const age = calculateAge(user.birthDate);
  return `${age.years} años ${age.months} meses ${age.days} días`;
});

onMounted(async () => {
  loadingUser.value = true;
  loadingDeparments.value = true;

  const departmentsResponse = await ubicationService.getDepartments();
  departments.splice(0, departments.length, ...departmentsResponse);
  loadingDeparments.value = false;

  const userId = route.params.id;
  if (userId) {
    isNewUser.value = false;
    const userResponse = await usersStore.getUser(userId);
    Object.assign(user, { ...user, ...userResponse });

    if (user.birthDate) {
      user.birthDate = stringToDate(user.birthDate);
    }
  }

  if (user.region) {
    loadingProvinces.value = true;
    const provincesResponse = await ubicationService.getProvinces(user.region);
    provinces.splice(0, provinces.length, ...provincesResponse);
    loadingProvinces.value = false;
  }

  if (user.province) {
    loadingDistritos.value = true;
    const distritosResponse = await ubicationService.getDistritos(user.region, user.province);
    distritos.splice(0, distritos.length, ...distritosResponse);
    loadingDistritos.value = false;
  }

  await rolesStore.getRolesOptions();
  await bloodBanksStore.getBloodBanksOptions();

  loadingUser.value = false;
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
    distritosResponse = await ubicationService.getDistritos(user.region, event.value);
  }
  distritos.splice(0, distritos.length, ...distritosResponse);
  loadingDistritos.value = false;
};

const statuses = ['ACTIVE', 'INACTIVE'];
const statusesOptions = statuses.map((status) => ({
  value: status,
  label: Status[status]
}));

const rules = computed(() => ({
  documentType: { required: required('Tipo de documento') },
  documentNumber: { required: required('Número de documento') },
  firstName: { required: required('Nombres'), minLength: minLength('Nombres', 2) },
  lastName: { required: required('Apellido paterno'), minLength: minLength('Apellido paterno', 2) },
  secondLastName: { minLength: minLength('Apellido materno', 2) },
  birthDate: { required: required('Fecha de nacimiento') },
  email: { required: required('Correo electrónico'), email: email('Correo electrónico') },
  gender: { required: required('Sexo') },
  phone: { required: required('Teléfono') },
  region: { required: required('Región') },
  province: { requiredIf: requiredIf('Provincia', () => user.region) },
  district: { requiredIf: requiredIf('Distrito', () => user.province) },
  address: { required: required('Dirección'), minLength: minLength('Dirección', 5) },
  status: {},
  bloodBankId: {
    requiredIf: requiredIf('Banco de sangre', () => user.roleId !== 1) // Cambia 1 por el ID real de "Administrador"
  },
  profileImageUrl: {}
}));
const v$ = useVuelidate(rules, user);
const documentNumberVerified = ref(null);

const saveUser = async () => {
  const isValid = await v$.value.$validate();
  await verifyDocumentNumber();
  if (!isValid || !documentNumberVerified.value) return;

  const saveMethod = isNewUser.value ? usersStore.newUser : usersStore.editUser;
  const success = await saveMethod(user);
  if (success) {
    router.push('/admin/users');
  }
};

const cancel = () => {
  router.push('/admin/users');
};

const verifyDocumentNumber = async () => {
  const response = await usersStore.verifyUser(user.id, user.documentNumber);
  documentNumberVerified.value = response;
};
</script>

<template>
  <div class="card" v-if="loadingUser">
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
  <form class="card" v-if="!loadingUser" @submit.prevent="saveUser">
    <div class="page-title | mb-8">
      <h3 v-if="isNewUser">Registro de nuevo usuario</h3>
      <h3 v-else>Editar usuario</h3>
    </div>
    <Fluid>
      <div class="flex flex-col md:flex-row gap-8 mb-8 md:mb-0">
        <div class="md:w-1/5">
          <div class="flex flex-col justify-center w-full gap-4 mb-8">
            <Image class="w-full aspect-square" alt="Image">
              <template #image>
                <img class="w-full object-cover aspect-square rounded-full" :src="userImage" alt="Image" />
              </template>
            </Image>
            <input type="file" ref="imageInput" @change="handleImageChange" style="display: none" accept="image/*" />
            <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Editar Imagen" severity="info" @click="onUploadImage" />
          </div>
        </div>
        <div class="md:grow">
          <div class="flex flex-col gap-4 w-full | mb-8">
            <div class="font-semibold text-xl">Información personal</div>
            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:col-span-3 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <Select id="documentType" v-model="user.documentType" :options="documentTypesOptions" optionLabel="label" optionValue="value" showClear aria-describedby="documentType" :invalid="v$.documentType?.$error" />
                  <label for="documentType">Tipo Documento</label>
                </FloatLabel>
                <Message v-if="v$.documentType?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.documentType.$errors[0].$message }}</Message>
              </span>
              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <InputGroup>
                  <FloatLabel variant="on" class="w-full">
                    <InputText id="documentNumber" v-model="user.documentNumber" aria-describedby="documentNumber" :invalid="v$.documentNumber?.$error || documentNumberVerified === false" @focusout="verifyDocumentNumber" />
                    <label for="documentNumber">Nro Documento</label>
                  </FloatLabel>
                  <InputGroupAddon><Button icon="pi pi-search" severity="secondary" variant="text" @click="verifyDocumentNumber" /></InputGroupAddon>
                </InputGroup>
                <Message v-if="documentNumberVerified === true" severity="success" size="small" variant="simple" class="pt-1">El documento ingresado está disponible</Message>
                <Message v-else-if="documentNumberVerified === false" severity="error" size="small" variant="simple" class="pt-1">El documento ingresado no está disponible</Message>
                <Message v-if="v$.documentNumber?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.documentNumber.$errors[0].$message }}</Message>
              </span>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <InputText id="firstName" v-model="user.firstName" aria-describedby="firstName" :invalid="v$.firstName?.$error" />
                  <label for="firstName">Nombres</label>
                </FloatLabel>
                <Message v-if="v$.firstName?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.firstName.$errors[0].$message }}</Message>
              </span>

              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <InputText id="lastName" v-model="user.lastName" aria-describedby="lastName" :invalid="v$.lastName?.$error" />
                  <label for="lastName">Apellido paterno</label>
                </FloatLabel>
                <Message v-if="v$.lastName?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.lastName.$errors[0].$message }}</Message>
              </span>

              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <InputText id="secondLastName" v-model="user.secondLastName" aria-describedby="secondLastName" :invalid="v$.secondLastName?.$error" />
                  <label for="secondLastName">Apellido materno</label>
                </FloatLabel>
                <Message v-if="v$.secondLastName?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.secondLastName.$errors[0].$message }}</Message>
              </span>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <DatePicker id="birthDate" v-model="user.birthDate" showIcon fluid dateFormat="dd/mm/yy" :maxDate="maxDate" aria-describedby="birthDate" :invalid="v$.birthDate?.$error" />
                  <label for="birthDate">Fecha de nacimiento</label>
                </FloatLabel>
                <Message v-if="v$.birthDate?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.birthDate.$errors[0].$message }}</Message>
              </span>

              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <InputText id="years" v-model="years" aria-describedby="years" disabled />
                  <label for="years">Edad</label>
                </FloatLabel>
              </span>
              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <Select id="id_gender" v-model="user.gender" :options="genderOptions" optionLabel="label" optionValue="value" showClear :invalid="v$.gender?.$error" />
                  <label for="id_gender">Sexo</label>
                </FloatLabel>
                <Message v-if="v$.gender?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.gender.$errors[0].$message }}</Message>
              </span>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <InputText id="email" v-model="user.email" aria-describedby="email" :invalid="v$.email?.$error" />
                  <label for="email">Email</label>
                </FloatLabel>
                <Message v-if="v$.email?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.email.$errors[0].$message }}</Message>
              </span>

              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <InputPhone class="w-full" id="phone" label="Teléfono" code_label="Código" v-model="user.phone" :invalid="v$.phone?.$error" />
                <Message v-if="v$.phone?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.phone.$errors[0].$message }}</Message>
              </span>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <Select id="id_region" v-model="user.region" :options="departments" showClear filter @change="onSelectDepartment" :loading="loadingDeparments" :invalid="v$.region?.$error" />
                  <label for="id_region">Departamento</label>
                </FloatLabel>
                <Message v-if="v$.region?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.region.$errors[0].$message }}</Message>
              </span>

              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <Select id="id_province" v-model="user.province" :options="provinces" showClear filter @change="onSelectProvince" :disabled="user.region === null" :loading="loadingProvinces" :invalid="v$.province?.$error" />
                  <label for="id_province">Provincia</label>
                </FloatLabel>
                <Message v-if="v$.province?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.province.$errors[0].$message }}</Message>
              </span>

              <span class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <FloatLabel variant="on" class="w-full">
                  <Select id="id_district" v-model="user.district" :options="distritos" showClear filter :disabled="user.province === null" :loading="loadingDistritos" :invalid="v$.district?.$error" />
                  <label for="id_district">Distrito</label>
                </FloatLabel>
                <Message v-if="v$.district?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.district.$errors[0].$message }}</Message>
              </span>
            </div>

            <span class="w-full col-span-12 mb-2 md:mb-0">
              <FloatLabel variant="on" class="w-full">
                <InputText id="address" v-model="user.address" aria-describedby="address" :invalid="v$.address?.$error" />
                <label for="address">Dirección</label>
              </FloatLabel>
              <Message v-if="v$.address?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.address.$errors[0].$message }}</Message>
            </span>

            <div class="grid grid-cols-12 gap-4">
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <Select id="status" v-model="user.status" :options="statusesOptions" optionLabel="label" optionValue="value" disabled />
                <label for="status">Estado</label>
              </FloatLabel>
            </div>
          </div>
          <div class="flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Lugar de trabajo</div>
            <div class="grid grid-cols-12 gap-2">
              <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Banco de sangre donde trabaja</label>
              <div class="col-span-12 md:col-span-4">
                <Select class="" v-model="user.bloodBankId" :options="bloodBanksStore.bloodBanksOptions" optionLabel="name" optionValue="id" showClear />
              </div>
            </div>
            <div class="grid grid-cols-12 gap-2">
              <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Rol que desempeña</label>
              <div class="col-span-12 md:col-span-4"><Select class="" v-model="user.roleId" :options="rolesStore.rolesOptions" optionLabel="name" optionValue="id" showClear /></div>
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
</template>
