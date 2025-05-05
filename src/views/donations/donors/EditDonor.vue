<script setup>
import { DocumentTypes } from '@/enums/DocumentTypes';
import { genderOptions } from '@/enums/Gender';
import { MaritalStatus } from '@/enums/MaritalStatus';
import router from '@/router';
import ubicationService from '@/services/ubication';
import { useDonorStore } from '@/stores/donation/donor';
import { email, minLength, required, requiredIf } from '@/validation/validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isNewDonor = ref(true);
const loadingDonor = ref(false);
const showSuccessDialog = ref(false);
const showCancelConfirmDialog = ref(false);
const donorStore = useDonorStore();

// Datos del formulario
const donor = reactive({
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
  occupation: '',
  placeOfBirth: '',
  placeOfOrigin: '',
  maritalStatus: '',
  trips: ''
});

const maxDate = ref(new Date());

const documentTypesOptions = Object.entries(DocumentTypes).map(([value, label]) => ({
  value,
  label
}));

const maritalOptions = Object.entries(MaritalStatus).map(([value, label]) => ({
  value,
  label
}));

const departments = reactive([]);
const loadingDeparments = ref(false);
const provinces = reactive([]);
const loadingProvinces = ref(false);
const distritos = reactive([]);
const loadingDistritos = ref(false);

function normalizeEmptyStringsToNull(obj) {
  const normalized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && value.trim() === '') {
      normalized[key] = null;
    } else {
      normalized[key] = value;
    }
  }
  return normalized;
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
  if (!donor.birthDate) return '';
  const age = calculateAge(donor.birthDate);
  return `${age.years} años ${age.months} meses ${age.days} días`;
});

function stringToDate(fechaString) {
  const partes = fechaString.split('/');
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1;
  const anio = parseInt(partes[2], 10);

  return new Date(anio, mes, dia);
}

onMounted(async () => {
  loadingDonor.value = true;
  loadingDeparments.value = true;

  const departmentsResponse = await ubicationService.getDepartments();
  departments.splice(0, departments.length, ...departmentsResponse);
  loadingDeparments.value = false;

  const documentNumber = route.params.doc;
  const documentType = route.params.type;
  if (documentNumber) {
    isNewDonor.value = false;
    const donorResponse = await donorStore.getDonor(documentNumber, documentType);
    for (const key in donor) {
      if (Object.prototype.hasOwnProperty.call(donorResponse, key)) {
        donor[key] = donorResponse[key];
      }
    }

    if (donor.birthDate) {
      donor.birthDate = stringToDate(donor.birthDate);
    }
  }

  if (donor.region) {
    loadingProvinces.value = true;
    const provincesResponse = await ubicationService.getProvinces(donor.region);
    provinces.splice(0, provinces.length, ...provincesResponse);
    loadingProvinces.value = false;
  }

  if (donor.province) {
    loadingDistritos.value = true;
    const distritosResponse = await ubicationService.getDistritos(donor.region, donor.province);
    distritos.splice(0, distritos.length, ...distritosResponse);
    loadingDistritos.value = false;
  }

  loadingDonor.value = false;
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
    distritosResponse = await ubicationService.getDistritos(donor.region, event.value);
  }
  distritos.splice(0, distritos.length, ...distritosResponse);
  loadingDistritos.value = false;
};
const rules = computed(() => ({
  documentType: { required: required('Tipo de documento') },
  documentNumber: { required: required('Número de documento') },
  firstName: { required: required('Nombres'), minLength: minLength('Nombres', 2) },
  lastName: { required: required('Apellido paterno'), minLength: minLength('Apellido paterno', 2) },
  secondLastName: { minLength: minLength('Apellido materno', 2) },
  birthDate: { required: required('Fecha de nacimiento') },
  email: { email: email('Correo electrónico') },
  gender: { required: required('Sexo') },
  phone: { required: required('Teléfono') },
  region: { required: required('Región') },
  province: { requiredIf: requiredIf('Provincia', () => donor.region) },
  district: { requiredIf: requiredIf('Distrito', () => donor.province) },
  address: { required: required('Dirección'), minLength: minLength('Dirección', 5) }
}));

const v$ = useVuelidate(rules, donor);
const documentNumberVerified = ref(null);

const verifyDocumentNumber = async () => {
  const response = await donorStore.verifyDonor(donor.id, donor.documentNumber, donor.documentType);
  documentNumberVerified.value = response;
};
const resetDonorForm = () => {
  donor.documentType = '';
  donor.documentNumber = '';
  donor.firstName = '';
  donor.lastName = '';
  donor.secondLastName = '';
  donor.birthDate = null;
  donor.gender = '';
  donor.email = '';
  donor.phone = '';
  donor.region = null;
  donor.province = null;
  donor.district = null;
  donor.address = '';
  donor.occupation = '';
  donor.placeOfBirth = '';
  donor.placeOfOrigin = '';
  donor.maritalStatus = '';
  donor.trips = '';

  documentNumberVerified.value = false;
  v$.value.$reset();
};

const saveDonor = async () => {
  if (isNewDonor.value) {
    await verifyDocumentNumber();
    if (!documentNumberVerified.value) return;
  }

  const isValid = await v$.value.$validate();
  if (!isValid) return;

  const donorNormalized = normalizeEmptyStringsToNull(donor);
  const saveMethod = isNewDonor.value ? donorStore.newDonor : donorStore.editDonor;
  const success = await saveMethod(donorNormalized);
  if (success) {
    showSuccessDialog.value = true;
    if (isNewDonor.value) {
      resetDonorForm();
    } else {
      router.back();
    }
  }
};
const confirmResetForm = () => {
  resetDonorForm();
  showCancelConfirmDialog.value = false;
};

const cancel = () => {
  if (isNewDonor.value) {
    showCancelConfirmDialog.value = true;
  } else {
    router.back();
  }
};
</script>

<template>
  <form class="card" v-if="!loadingDonor" @submit.prevent="saveDonor">
    <h3 v-if="isNewDonor">Registrar donante</h3>
    <h3 v-else>Editar donante</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <div class="flex">
          <div class="flex justify-center items-center">
            <label class="block mb-1 mr-4">Identificación:</label>
          </div>
          <span class="w-full mr-2">
            <FloatLabel variant="on">
              <Select id="documentType" v-model="donor.documentType" :options="documentTypesOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.documentType?.$error" :disabled="!isNewDonor" />
              <label for="documentType">Tipo Documento</label>
            </FloatLabel>
            <Message v-if="v$.documentType?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.documentType.$errors[0].$message }}</Message>
          </span>
        </div>
      </div>
      <div>
        <div class="flex">
          <span class="w-full mr-2">
            <InputGroup>
              <FloatLabel variant="on" class="w-full">
                <InputText
                  id="documentNumber"
                  v-model="donor.documentNumber"
                  aria-describedby="documentNumber"
                  :disabled="!donor.documentType || !isNewDonor"
                  :invalid="v$.documentNumber?.$error || documentNumberVerified === false"
                  @focusout="verifyDocumentNumber"
                />
                <label for="documentNumber">Nro Documento</label>
              </FloatLabel>
              <InputGroupAddon><Button icon="pi pi-search" severity="secondary" variant="text" @click="verifyDocumentNumber" /></InputGroupAddon>
            </InputGroup>
            <Message v-if="documentNumberVerified === true" severity="success" size="small" variant="simple" class="pt-1">El documento ingresado está disponible</Message>
            <Message v-else-if="documentNumberVerified === false" severity="error" size="small" variant="simple" class="pt-1">El documento ingresado no está disponible</Message>
            <Message v-if="v$.documentNumber?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.documentNumber.$errors[0].$message }}</Message>
          </span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <FloatLabel variant="on">
          <InputText id="firstName" v-model="donor.firstName" class="w-full" :invalid="v$.firstName?.$error" />
          <label for="firstName">Nombres</label>
        </FloatLabel>
        <Message v-if="v$.firstName?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.firstName.$errors[0].$message }}</Message>
      </div>
      <div>
        <FloatLabel variant="on">
          <InputText id="lastName" v-model="donor.lastName" class="w-full" :invalid="v$.lastName?.$error" />
          <label for="lastName">Apellido Paterno</label>
        </FloatLabel>
        <Message v-if="v$.lastName?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.lastName.$errors[0].$message }}</Message>
      </div>
      <div>
        <FloatLabel variant="on">
          <InputText id="secondLastName" v-model="donor.secondLastName" class="w-full" :invalid="v$.secondLastName?.$error" />
          <label for="secondLastName">Apellido Materno</label>
        </FloatLabel>
        <Message v-if="v$.secondLastName?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.secondLastName.$errors[0].$message }}</Message>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <div class="p-inputgroup">
          <span class="w-full">
            <FloatLabel variant="on">
              <DatePicker id="birthDate" v-model="donor.birthDate" showIcon fluid dateFormat="dd/mm/yy" :maxDate="maxDate" aria-describedby="birthDate" :invalid="v$.birthDate?.$error" />
              <label for="birthDate">Fecha nacimiento</label>
            </FloatLabel>
            <Message v-if="v$.birthDate?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.birthDate.$errors[0].$message }}</Message>
          </span>
        </div>
      </div>
      <div>
        <FloatLabel variant="on">
          <InputText id="years" v-model="years" aria-describedby="years" disabled class="w-full" />
          <label for="years">Edad</label>
        </FloatLabel>
      </div>
      <div>
        <FloatLabel variant="on">
          <Select id="id_gender" v-model="donor.gender" :options="genderOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.gender?.$error" />
          <label for="id_gender">Sexo</label>
        </FloatLabel>
        <Message v-if="v$.gender?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.gender.$errors[0].$message }}</Message>
      </div>
    </div>

    <div class="mb-4">
      <FloatLabel variant="on">
        <InputText id="placeOfBirth" v-model="donor.placeOfBirth" class="w-full" />
        <label for="placeOfBirth">Lugar de Nacimiento</label>
      </FloatLabel>
    </div>

    <div class="mb-4">
      <FloatLabel variant="on">
        <InputText id="placeOfOrigin" v-model="donor.placeOfOrigin" class="w-full" />
        <label for="placeOfOrigin">Procedencia</label>
      </FloatLabel>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <FloatLabel variant="on">
          <Select id="id_region" class="w-full" v-model="donor.region" :options="departments" showClear filter @change="onSelectDepartment" :loading="loadingDeparments" :invalid="v$.region?.$error" />
          <label for="id_region">Departamento</label>
        </FloatLabel>
        <Message v-if="v$.region?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.region.$errors[0].$message }}</Message>
      </div>
      <div>
        <FloatLabel variant="on">
          <Select id="id_province" class="w-full" v-model="donor.province" :options="provinces" showClear filter @change="onSelectProvince" :disabled="donor.region === null" :loading="loadingProvinces" :invalid="v$.province?.$error" />
          <label for="id_province">Provincia</label>
        </FloatLabel>
        <Message v-if="v$.province?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.province.$errors[0].$message }}</Message>
      </div>
      <div>
        <FloatLabel variant="on">
          <Select id="id_district" class="w-full" v-model="donor.district" :options="distritos" showClear filter :disabled="donor.province === null" :loading="loadingDistritos" :invalid="v$.district?.$error" />
          <label for="id_district">Distrito</label>
        </FloatLabel>
        <Message v-if="v$.district?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.district.$errors[0].$message }}</Message>
      </div>
    </div>

    <div class="mb-4">
      <FloatLabel variant="on">
        <InputText id="address" v-model="donor.address" class="w-full" :invalid="v$.address?.$error" />
        <label for="address">Domicilio</label>
      </FloatLabel>
      <Message v-if="v$.address?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.address.$errors[0].$message }}</Message>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <FloatLabel variant="on">
          <InputText id="occupation" v-model="donor.occupation" class="w-full" />
          <label for="occupation">Ocupación</label>
        </FloatLabel>
      </div>
      <div>
        <FloatLabel variant="on">
          <Select id="maritalStatus" v-model="donor.maritalStatus" :options="maritalOptions" optionLabel="label" optionValue="value" class="w-full" />
          <label for="maritalStatus">Estado civil</label>
        </FloatLabel>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <FloatLabel variant="on">
          <InputText id="email" v-model="donor.email" class="w-full" />
          <label for="email">Email</label>
        </FloatLabel>
      </div>
      <div>
        <FloatLabel variant="on">
          <InputText id="phone" v-model="donor.phone" class="w-full" :invalid="v$.phone?.$error" />
          <label for="phone">Teléfono</label>
        </FloatLabel>
        <Message v-if="v$.phone?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.phone.$errors[0].$message }}</Message>
      </div>
    </div>

    <div class="mb-4">
      <FloatLabel variant="on">
        <Textarea id="trips" v-model="donor.trips" rows="5" class="w-full resize-none" />
        <label for="trips">Viajes</label>
      </FloatLabel>
    </div>

    <div class="flex justify-end mt-4 gap-2">
      <Button class="min-w-40 btn-clean" label="Cancelar" @click="cancel" />
      <Button class="min-w-40 p-button-success" label="Guardar" type="submit" />
    </div>
  </form>
  <Dialog header="Donante guardado" v-model:visible="showSuccessDialog" modal dismissableMask>
    <p>El donante se ha guardado correctamente.</p>
    <template #footer>
      <Button label="Aceptar" class="p-button-success" @click="showSuccessDialog = false" />
    </template>
  </Dialog>
  <Dialog v-model:visible="showCancelConfirmDialog" modal header="Confirmación" :style="{ width: '350px' }">
    <span>¿Estás seguro de que deseas limpiar el formulario?</span>
    <template #footer>
      <Button label="No" @click="showCancelConfirmDialog = false" />
      <Button label="Sí" class="p-button-danger" @click="confirmResetForm" />
    </template>
  </Dialog>
</template>
