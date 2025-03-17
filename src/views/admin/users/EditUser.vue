<script setup>
import InputPhone from '@/components/utils/InputPhone.vue';
import { DocumentTypes } from '@/enums/DocumentTypes';
import { Status } from '@/enums/Status';
import ubicationService from '@/services/ubication';
import { useUsersStore } from '@/stores/users';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();

const isNewUser = ref(true);
const loadingUser = ref(false);
const user = reactive({
  documentType: '',
  documentNumber: '',
  firstNames: '',
  lastName: '',
  secondLastName: '',
  birthday: null,
  email: '',
  phone: '',
  department: null,
  province: null,
  distrito: null,
  address: '',
  status: 'ACTIVE',
  bloodBank: '',
  bloodBankRole: ''
});

const maxDate = ref(new Date());

const documentTypes = ['DNI', 'CE', 'PASSPORT', 'OTHERS'];
const documentTypesOptions = documentTypes.map((type) => ({
  value: type,
  label: DocumentTypes[type]
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

function calculateAge(birthday) {
  const today = new Date();
  const birthDate = new Date(birthday);

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
  if (!user.birthday) return '';
  const age = calculateAge(user.birthday);
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
  }
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
    distritosResponse = await ubicationService.getDistritos(user.department, event.value);
  }
  distritos.splice(0, distritos.length, ...distritosResponse);
  loadingDistritos.value = false;
};

const statuses = ['ACTIVE', 'INACTIVE'];
const statusesOptions = statuses.map((status) => ({
  value: status,
  label: Status[status]
}));

const saveUser = async () => {
  const saveMethod = isNewUser.value ? usersStore.newUser : usersStore.editUser;
  const success = await saveMethod(user);
  if (success) {
    router.push('/admin/users');
  }
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
  <div class="card" v-else>
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
          <Message severity="error">
            <div class="flex flex-col">
              <h5 class="text-inherit text-center mb-6">Reestablecimiento de contraseña</h5>
              <span class="flex justify-center items-center gap-4 mb-6">
                <span class="p-message-icon pi pi-exclamation-triangle" data-pc-section="icon"> </span>
                <span>Se enviaará una contraseña generada al correro registrado del usuario, podrá cambiarla al ingresar</span>
              </span>
              <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Enviar contraseña" severity="danger" />
            </div>
          </Message>
        </div>
        <div class="md:grow">
          <div class="flex flex-col gap-4 w-full | mb-8">
            <div class="font-semibold text-xl">Información personal</div>
            <div class="grid grid-cols-12 gap-4">
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-2 md:mb-0">
                <Select id="documentType" v-model="user.documentType" :options="documentTypesOptions" optionLabel="label" optionValue="value" showClear aria-describedby="documentType" />
                <label for="documentType">Tipo Documento</label>
              </FloatLabel>
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <InputText id="documentNumber" v-model="user.documentNumber" aria-describedby="documentNumber" />
                <label for="documentNumber">Nro Documento</label>
              </FloatLabel>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <InputText id="firstNames" v-model="user.firstNames" aria-describedby="firstNames" />
                <label for="firstNames">Nombres</label>
              </FloatLabel>

              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <InputText id="lastName" v-model="user.lastName" aria-describedby="lastName" />
                <label for="lastName">Apellido paterno</label>
              </FloatLabel>

              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <InputText id="secondLastName" v-model="user.secondLastName" aria-describedby="secondLastName" />
                <label for="secondLastName">Apellido materno</label>
              </FloatLabel>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-2 md:mb-0">
                <DatePicker id="birthday" v-model="user.birthday" showIcon iconDisplay="input" dateFormat="dd/mm/yy" :maxDate="maxDate" aria-describedby="birthday" />
                <label for="birthday">Fecha de nacimiento</label>
              </FloatLabel>

              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-2 md:mb-0">
                <InputText id="years" v-model="years" aria-describedby="years" disabled />
                <label for="years">Edad</label>
              </FloatLabel>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <InputText id="email" v-model="user.email" aria-describedby="email" />
                <label for="email">Email</label>
              </FloatLabel>

              <InputPhone class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0" id="phone" label="Teléfono" code_label="Código" v-model="user.phone" />
            </div>

            <div class="grid grid-cols-12 gap-4">
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <Select id="id_department" v-model="user.department" :options="departments" showClear filter @change="onSelectDepartment" :loading="loadingDeparments" />
                <label for="id_department">Departamento</label>
              </FloatLabel>

              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <Select id="id_province" v-model="user.province" :options="provinces" showClear filter @change="onSelectProvince" :disabled="user.department === null" :loading="loadingProvinces" />
                <label for="id_province">Provincia</label>
              </FloatLabel>

              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <Select id="id_distrito" v-model="user.distrito" :options="distritos" showClear filter :disabled="user.province === null" :loading="loadingDistritos" />
                <label for="id_distrito">Distrito</label>
              </FloatLabel>
            </div>

            <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:mb-0">
              <InputText id="address" v-model="user.address" aria-describedby="address" />
              <label for="address">Dirección</label>
            </FloatLabel>

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
                <Select class="" v-model="user.bloodBank" :options="[]" optionLabel="label" optionValue="value" showClear />
              </div>
            </div>
            <div class="grid grid-cols-12 gap-2">
              <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Rol que desempeña</label>
              <div class="col-span-12 md:col-span-4">
                <Select class="" v-model="user.bloodBankRole" :options="[]" optionLabel="label" optionValue="value" showClear />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fluid>
    <div class="w-full flex items-denter justify-end mb-4 gap-4">
      <Button class="min-w-40" label="Cancelar" text />
      <Button class="min-w-40 p-button-success" label="Guardar" @click="saveUser" />
    </div>
  </div>
</template>
