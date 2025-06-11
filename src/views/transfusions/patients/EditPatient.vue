<script setup>
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { bloodGroupOptions, rhFactorOptions } from '@/enums/BloodType';
import { DocumentTypes } from '@/enums/DocumentTypes';
import { genderOptions } from '@/enums/Gender';
import router from '@/router';
import ubicationService from '@/services/ubication';
import { usePatientStore } from '@/stores/transfusion/patient';
import { email, minLength, required, requiredIf } from '@/validation/validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isNewPatient = ref(true);
const loadingPatient = ref(false);
const patientStore = usePatientStore();

const showConfirmModal = ref(false);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);

const showCancelConfirmDialog = ref(false);

const patient = reactive({
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
  allergic: '',
  bloodType: '',
  rhFactor: '',
  numberBirths: null
});

const maxDate = ref(new Date());

const documentTypesOptions = Object.entries(DocumentTypes).map(([value, label]) => ({
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
  if (!patient.birthDate) return '';
  const age = calculateAge(patient.birthDate);
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
  loadingPatient.value = true;
  loadingDeparments.value = true;

  const departmentsResponse = await ubicationService.getDepartments();
  departments.splice(0, departments.length, ...departmentsResponse);
  loadingDeparments.value = false;

  const documentNumber = route.params.doc;
  const documentType = route.params.type;
  if (documentNumber) {
    isNewPatient.value = false;
    const patientResponse = await patientStore.getPatient(documentNumber, documentType);
    for (const key in patient) {
      if (Object.prototype.hasOwnProperty.call(patientResponse, key)) {
        patient[key] = patientResponse[key];
      }
    }

    if (patient.birthDate) {
      patient.birthDate = stringToDate(patient.birthDate);
    }
  }

  if (patient.region) {
    loadingProvinces.value = true;
    const provincesResponse = await ubicationService.getProvinces(patient.region);
    provinces.splice(0, provinces.length, ...provincesResponse);
    loadingProvinces.value = false;
  }

  if (patient.province) {
    loadingDistritos.value = true;
    const distritosResponse = await ubicationService.getDistritos(patient.region, patient.province);
    distritos.splice(0, distritos.length, ...distritosResponse);
    loadingDistritos.value = false;
  }

  loadingPatient.value = false;
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
    distritosResponse = await ubicationService.getDistritos(patient.region, event.value);
  }
  distritos.splice(0, distritos.length, ...distritosResponse);
  loadingDistritos.value = false;
};
const rules = computed(() => ({
  documentType: { required: required('Tipo de documento') },
  documentNumber: { required: required('Número de documento') },
  firstName: { required: required('Nombres'), minLength: minLength('Nombres', 2) },
  lastName: { required: required('Apellido paterno'), minLength: minLength('Apellido paterno', 2) },
  secondLastName: { required: required('Apellido materno'), minLength: minLength('Apellido materno', 2) },
  birthDate: { required: required('Fecha de nacimiento') },
  email: { email: email('Correo electrónico') },
  gender: { required: required('Sexo') },
  phone: { required: required('Teléfono') },
  region: { required: required('Región') },
  province: { requiredIf: requiredIf('Provincia', () => patient.region) },
  district: { requiredIf: requiredIf('Distrito', () => patient.province) },
  address: { required: required('Dirección'), minLength: minLength('Dirección', 5) },
  bloodType: { required: required('Grupo sanguíneo') },
  rhFactor: { required: required('Rh factor') },
  numberBirths: { requiredIf: requiredIf('Número de partos', () => patient.gender === 'Femenino') }
}));

const v$ = useVuelidate(rules, patient);
const documentNumberVerified = ref(null);

const verifyDocumentNumber = async () => {
  if (!patient.documentType) return;
  const response = await patientStore.verifyPatient(patient.documentNumber, patient.documentType);
  documentNumberVerified.value = response;
};
const resetPatientForm = () => {
  patient.documentType = '';
  patient.documentNumber = '';
  patient.firstName = '';
  patient.lastName = '';
  patient.secondLastName = '';
  patient.birthDate = null;
  patient.gender = '';
  patient.email = '';
  patient.phone = '';
  patient.region = null;
  patient.province = null;
  patient.district = null;
  patient.address = '';
  patient.allergic = '';
  patient.bloodType = '';
  patient.rhFactor = '';
  patient.numberBirths = null;

  documentNumberVerified.value = false;
  v$.value.$reset();
};

const confirmSuccessOperation = () => {
  if (isNewPatient.value) {
    resetPatientForm();
    showSuccessModal.value = false;
  } else {
    router.back();
  }
};

const savePatient = async () => {
  const patientNormalized = normalizeEmptyStringsToNull(patient);
  const saveMethod = isNewPatient.value ? patientStore.newPatient : patientStore.editPatient;
  const success = await saveMethod(patientNormalized);
  if (success) {
    showSuccessModal.value = true;
  } else {
    showErrorModal.value = true;
  }
};

const handleSavePatient = async () => {
  if (isNewPatient.value) {
    await verifyDocumentNumber();
    if (!documentNumberVerified.value) return;
  }

  const isValid = await v$.value.$validate();
  if (!isValid) return;

  showConfirmModal.value = true;
};
const confirmResetForm = () => {
  resetPatientForm();
  showCancelConfirmDialog.value = false;
};

const cancel = () => {
  if (isNewPatient.value) {
    showCancelConfirmDialog.value = true;
  } else {
    router.back();
  }
};
</script>

<template>
  <div v-if="loadingPatient" class="card absolute inset-0 bg-white/50 flex items-center justify-center z-10">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else class="card">
    <form @submit.prevent="handleSavePatient">
      <h3 v-if="isNewPatient">Registrar paciente</h3>
      <h3 v-else>Editar paciente</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div class="flex">
            <div class="flex justify-center items-center">
              <label class="block mb-1 mr-4">Identificación:</label>
            </div>
            <span class="w-full mr-2">
              <FloatLabel variant="on">
                <Select id="documentType" v-model="patient.documentType" :options="documentTypesOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.documentType?.$error" :disabled="!isNewPatient" />
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
                    v-model="patient.documentNumber"
                    aria-describedby="documentNumber"
                    :disabled="!patient.documentType || !isNewPatient"
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
            <InputText id="firstName" v-model="patient.firstName" class="w-full" :invalid="v$.firstName?.$error" />
            <label for="firstName">Nombres</label>
          </FloatLabel>
          <Message v-if="v$.firstName?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.firstName.$errors[0].$message }}</Message>
        </div>
        <div>
          <FloatLabel variant="on">
            <InputText id="lastName" v-model="patient.lastName" class="w-full" :invalid="v$.lastName?.$error" />
            <label for="lastName">Apellido Paterno</label>
          </FloatLabel>
          <Message v-if="v$.lastName?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.lastName.$errors[0].$message }}</Message>
        </div>
        <div>
          <FloatLabel variant="on">
            <InputText id="secondLastName" v-model="patient.secondLastName" class="w-full" :invalid="v$.secondLastName?.$error" />
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
                <DatePicker id="birthDate" v-model="patient.birthDate" showIcon fluid dateFormat="dd/mm/yy" :maxDate="maxDate" aria-describedby="birthDate" :invalid="v$.birthDate?.$error" />
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
            <Select id="id_gender" v-model="patient.gender" :options="genderOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.gender?.$error" />
            <label for="id_gender">Sexo</label>
          </FloatLabel>
          <Message v-if="v$.gender?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.gender.$errors[0].$message }}</Message>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <Select id="id_region" class="w-full" v-model="patient.region" :options="departments" showClear filter @change="onSelectDepartment" :loading="loadingDeparments" :invalid="v$.region?.$error" />
            <label for="id_region">Departamento</label>
          </FloatLabel>
          <Message v-if="v$.region?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.region.$errors[0].$message }}</Message>
        </div>
        <div>
          <FloatLabel variant="on">
            <Select id="id_province" class="w-full" v-model="patient.province" :options="provinces" showClear filter @change="onSelectProvince" :disabled="patient.region === null" :loading="loadingProvinces" :invalid="v$.province?.$error" />
            <label for="id_province">Provincia</label>
          </FloatLabel>
          <Message v-if="v$.province?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.province.$errors[0].$message }}</Message>
        </div>
        <div>
          <FloatLabel variant="on">
            <Select id="id_district" class="w-full" v-model="patient.district" :options="distritos" showClear filter :disabled="patient.province === null" :loading="loadingDistritos" :invalid="v$.district?.$error" />
            <label for="id_district">Distrito</label>
          </FloatLabel>
          <Message v-if="v$.district?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.district.$errors[0].$message }}</Message>
        </div>
      </div>

      <div class="mb-4">
        <FloatLabel variant="on">
          <InputText id="address" v-model="patient.address" class="w-full" :invalid="v$.address?.$error" />
          <label for="address">Domicilio</label>
        </FloatLabel>
        <Message v-if="v$.address?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.address.$errors[0].$message }}</Message>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <InputText id="email" v-model="patient.email" class="w-full" />
            <label for="email">Email</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel variant="on">
            <InputText id="phone" v-model="patient.phone" class="w-full" :invalid="v$.phone?.$error" />
            <label for="phone">Teléfono</label>
          </FloatLabel>
          <Message v-if="v$.phone?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.phone.$errors[0].$message }}</Message>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <Select id="bloodType" v-model="patient.bloodType" :options="bloodGroupOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.bloodType?.$error" />
            <label for="bloodType">Grupo sanguíneo</label>
          </FloatLabel>
          <Message v-if="v$.bloodType?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.bloodType.$errors[0].$message }}</Message>
        </div>
        <div>
          <FloatLabel variant="on">
            <Select id="rhFactor" v-model="patient.rhFactor" :options="rhFactorOptions" optionLabel="label" optionValue="value" class="w-full" :invalid="v$.rhFactor?.$error" />
            <label for="rhFactor">Rh factor</label>
          </FloatLabel>
          <Message v-if="v$.rhFactor?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.rhFactor.$errors[0].$message }}</Message>
        </div>

        <div v-if="patient.gender === 'Femenino'">
          <FloatLabel variant="on">
            <InputNumber id="numberBirths" v-model="patient.numberBirths" class="w-full" :invalid="v$.numberBirths?.$error" />
            <label for="numberBirths">Número de partos</label>
          </FloatLabel>
          <Message v-if="v$.numberBirths?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.numberBirths.$errors[0].$message }}</Message>
        </div>
      </div>

      <div class="mb-4">
        <FloatLabel variant="on">
          <Textarea id="allergic" v-model="patient.allergic" rows="5" class="w-full resize-none" />
          <label for="allergic">Alergias</label>
        </FloatLabel>
      </div>

      <div class="flex justify-end mt-4 gap-2">
        <Button class="min-w-40 btn-clean" label="Cancelar" @click="cancel" />
        <Button class="min-w-40 p-button-success" label="Guardar" type="submit" />
      </div>
    </form>
    <ConfirmModal v-model="showConfirmModal" header="¿Estás seguro de guardar este paciente?" accept-text="Guardar" @accept="savePatient" />
    <SuccessModal v-model="showSuccessModal" message="El paciente fue guardado con éxito" @close="confirmSuccessOperation" />
    <ErrorModal v-model="showErrorModal" />
    <!-- <Dialog header="Paciente guardado" v-model:visible="showSuccessDialog" modal dismissableMask>
    <p>El paciente se ha guardado correctamente.</p>
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
  </Dialog> -->
    <ConfirmModal id="cancelConfirmDialog" v-model="showCancelConfirmDialog" header="¿Estás seguro de que deseas limpiar el formulario?" accept-text="Sí" accept-button-class="p-button-danger" @accept="confirmResetForm" reject-text="No" />
  </div>
</template>
